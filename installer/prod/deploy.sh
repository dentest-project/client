#!/bin/sh
set -eu

SCRIPT_DIR="$(CDPATH= cd -- "$(dirname -- "$0")" && pwd -P)"
PROJECT_DIR="$(dirname "$(dirname "$SCRIPT_DIR")")"

COMPOSE_FILE="${COMPOSE_FILE:-$SCRIPT_DIR/docker-compose.yml}"
COMPOSE_PROJECT_NAME="${COMPOSE_PROJECT_NAME:-dentest_client}"
HTTP_PORT="${HTTP_PORT:-80}"
STATE_FILE="${STATE_FILE:-$PROJECT_DIR/.active_color}"
LOCK_FILE="${LOCK_FILE:-$PROJECT_DIR/.deploy.lock}"
LOCK_DIR="${LOCK_DIR:-$PROJECT_DIR/.deploy.lock.d}"
PROXY_CONF="${PROXY_CONF:-$SCRIPT_DIR/nginx/default.conf}"
PROXY_TEMPLATE="${PROXY_TEMPLATE:-$SCRIPT_DIR/nginx/default.conf.template}"
HEALTH_TIMEOUT_SECONDS="${HEALTH_TIMEOUT_SECONDS:-120}"
PROXY_HEALTH_TIMEOUT_SECONDS="${PROXY_HEALTH_TIMEOUT_SECONDS:-30}"
SMOKE_TEST_PATH="${SMOKE_TEST_PATH:-/}"
DRAIN_SECONDS="${DRAIN_SECONDS:-30}"
SERVER_NAME="${SERVER_NAME:-_}"
PROXY_STARTED_BY_DEPLOY=0
STOPPED_LEGACY_MAIN_IDS=""

export COMPOSE_PROJECT_NAME
export HTTP_PORT

compose() {
  docker compose -f "$COMPOSE_FILE" "$@"
}

log() {
  printf '%s\n' "$*"
}

cleanup_lock_dir() {
  if [ "${LOCK_DIR_ACQUIRED:-0}" = "1" ]; then
    rmdir "$LOCK_DIR" 2>/dev/null || true
  fi
}

acquire_lock() {
  if command -v flock >/dev/null 2>&1; then
    exec 9>"$LOCK_FILE"
    if ! flock -n 9; then
      log "Another deployment is already running"
      exit 1
    fi
    return
  fi

  if mkdir "$LOCK_DIR" 2>/dev/null; then
    LOCK_DIR_ACQUIRED=1
    trap cleanup_lock_dir EXIT HUP INT TERM
    return
  fi

  log "Another deployment is already running"
  exit 1
}

is_running() {
  container_id="$1"

  [ -n "$container_id" ] || return 1
  [ "$(docker inspect --format '{{.State.Running}}' "$container_id" 2>/dev/null || true)" = "true" ]
}

detect_active_color() {
  if [ -f "$PROXY_CONF" ]; then
    if grep -Eq 'proxy_pass http://app_blue:3000|set[[:space:]]+\$app_upstream[[:space:]]+app_blue;' "$PROXY_CONF"; then
      printf '%s\n' blue
      return
    fi

    if grep -Eq 'proxy_pass http://app_green:3000|set[[:space:]]+\$app_upstream[[:space:]]+app_green;' "$PROXY_CONF"; then
      printf '%s\n' green
      return
    fi
  fi

  if [ -f "$STATE_FILE" ]; then
    active_color="$(cat "$STATE_FILE")"
    case "$active_color" in
      blue|green)
        printf '%s\n' "$active_color"
        return
        ;;
    esac
  fi

  blue_id="$(compose ps -q app_blue 2>/dev/null || true)"
  green_id="$(compose ps -q app_green 2>/dev/null || true)"

  if is_running "$blue_id"; then
    printf '%s\n' blue
    return
  fi

  if is_running "$green_id"; then
    printf '%s\n' green
    return
  fi

  # Pick green as the inactive default so the first deployment starts blue.
  printf '%s\n' green
}

wait_for_healthy() {
  service="$1"
  deadline="$(($(date +%s) + HEALTH_TIMEOUT_SECONDS))"

  while :; do
    container_id="$(compose ps -q "$service" 2>/dev/null || true)"

    if [ -n "$container_id" ]; then
      status="$(docker inspect --format '{{if .State.Health}}{{.State.Health.Status}}{{else}}{{.State.Status}}{{end}}' "$container_id" 2>/dev/null || true)"

      case "$status" in
        healthy)
          return 0
          ;;
        exited|dead)
          docker logs "$container_id" --tail 80 || true
          return 1
          ;;
      esac
    fi

    if [ "$(date +%s)" -ge "$deadline" ]; then
      log "$service did not become healthy within ${HEALTH_TIMEOUT_SECONDS}s"
      if [ -n "${container_id:-}" ]; then
        docker logs "$container_id" --tail 80 || true
      fi
      return 1
    fi

    sleep 2
  done
}

render_proxy_conf() {
  upstream_service="$1"
  server_name="$SERVER_NAME"

  if [ -z "$server_name" ] || printf '%s' "$server_name" | grep -q '[/;\\]'; then
    server_name="_"
  fi

  mkdir -p "$(dirname "$PROXY_CONF")"
  awk \
    -v upstream="$upstream_service" \
    -v server_name="$server_name" \
    '{ gsub(/__APP_UPSTREAM__/, upstream); gsub(/__SERVER_NAME__/, server_name); print }' \
    "$PROXY_TEMPLATE" > "${PROXY_CONF}.next"
}

install_proxy_conf() {
  if [ -f "$PROXY_CONF" ]; then
    cp "$PROXY_CONF" "${PROXY_CONF}.previous"
  fi

  mv "${PROXY_CONF}.next" "$PROXY_CONF"
}

restore_previous_proxy_conf() {
  if [ -f "${PROXY_CONF}.previous" ]; then
    mv "${PROXY_CONF}.previous" "$PROXY_CONF"
  fi
}

reload_proxy() {
  compose exec -T proxy nginx -t && compose exec -T proxy nginx -s reload
}

rollback_proxy_switch() {
  proxy_id="$(compose ps -q proxy 2>/dev/null || true)"

  if [ -f "${PROXY_CONF}.previous" ]; then
    log "Restoring previous proxy configuration"
    restore_previous_proxy_conf

    if [ "$PROXY_STARTED_BY_DEPLOY" != "1" ] && is_running "$proxy_id"; then
      reload_proxy || true
    fi
  fi

  if [ "$PROXY_STARTED_BY_DEPLOY" = "1" ]; then
    compose stop proxy || true
  fi

  restart_legacy_main "$STOPPED_LEGACY_MAIN_IDS"
}

print_service_diagnostics() {
  service="$1"
  container_id="$(compose ps -q "$service" 2>/dev/null || true)"

  compose ps || true

  if [ -n "$container_id" ]; then
    docker logs "$container_id" --tail 80 || true
  fi
}

expect_exact_response() {
  label="$1"
  expected="$2"
  shift
  shift

  response="$("$@" 2>&1)" || {
    log "$label failed"
    printf '%s\n' "$response"
    return 1
  }

  if [ "$response" != "$expected" ]; then
    log "$label returned an unexpected response"
    printf '%s\n' "$response"
    return 1
  fi
}

expect_ok_response() {
  label="$1"
  shift

  expect_exact_response "$label" ok "$@"
}

expect_http_success() {
  label="$1"
  shift

  response="$("$@" 2>&1)" || {
    log "$label failed"
    printf '%s\n' "$response"
    return 1
  }
}

smoke_test_path() {
  case "$SMOKE_TEST_PATH" in
    /*)
      printf '%s\n' "$SMOKE_TEST_PATH"
      ;;
    *)
      printf '/%s\n' "$SMOKE_TEST_PATH"
      ;;
  esac
}

validate_upstream_reachable() {
  service="$1"

  expect_ok_response \
    "Upstream probe for $service" \
    docker run --rm \
      --network "${COMPOSE_PROJECT_NAME}_default" \
      nginx:1.27-alpine \
      wget -q -T 3 -O - "http://${service}:3000/healthz"
}

validate_upstream_smoke() {
  service="$1"
  path="$(smoke_test_path)"

  expect_http_success \
    "Upstream smoke probe for $service $path" \
    docker run --rm \
      --network "${COMPOSE_PROJECT_NAME}_default" \
      nginx:1.27-alpine \
      wget -q -T 5 -O /dev/null "http://${service}:3000${path}"
}

validate_proxy_loaded_upstream() {
  expected_service="$1"

  expect_exact_response \
    "Proxy active upstream probe" \
    "$expected_service" \
    compose exec -T proxy wget -q -T 3 -O - "http://127.0.0.1/__active_upstream"
}

validate_proxy_smoke() {
  path="$(smoke_test_path)"

  expect_http_success \
    "Proxy smoke probe $path" \
    compose exec -T proxy wget -q -T 5 -O /dev/null "http://127.0.0.1${path}"
}

validate_published_proxy_smoke() {
  path="$(smoke_test_path)"

  expect_http_success \
    "Published proxy smoke probe :${HTTP_PORT}${path}" \
    docker run --rm \
      --network host \
      nginx:1.27-alpine \
      wget -q -T 5 -O /dev/null "http://127.0.0.1:${HTTP_PORT}${path}"
}

wait_for_proxy_healthy() {
  expected_service="$1"
  deadline="$(($(date +%s) + PROXY_HEALTH_TIMEOUT_SECONDS))"

  while :; do
    if expect_ok_response \
      "Proxy health probe" \
      compose exec -T proxy wget -q -T 3 -O - "http://127.0.0.1/healthz"; then
      if validate_proxy_loaded_upstream "$expected_service"; then
        return 0
      fi
    fi

    if [ "$(date +%s)" -ge "$deadline" ]; then
      log "proxy did not return a healthy response within ${PROXY_HEALTH_TIMEOUT_SECONDS}s"
      return 1
    fi

    sleep 2
  done
}

absolute_path() {
  case "$1" in
    /*)
      printf '%s\n' "$1"
      ;;
    *)
      printf '%s/%s\n' "$(pwd -P)" "$1"
      ;;
  esac
}

validate_proxy_config_standalone() {
  proxy_conf_path="$(absolute_path "$PROXY_CONF")"
  docker run --rm \
    --network "${COMPOSE_PROJECT_NAME}_default" \
    -v "$proxy_conf_path:/etc/nginx/conf.d/default.conf:ro" \
    nginx:1.27-alpine nginx -t
}

restart_legacy_main() {
  legacy_main_ids="$1"

  if [ -n "$legacy_main_ids" ]; then
    log "Restarting legacy main container after proxy startup failure"
    docker start $legacy_main_ids || true
  fi
}

reload_or_start_proxy() {
  proxy_id="$(compose ps -q proxy 2>/dev/null || true)"

  if is_running "$proxy_id"; then
    if reload_proxy; then
      return
    fi

    rollback_proxy_switch
    return 1
  fi

  legacy_main_ids="$(docker ps -q \
    --filter "label=com.docker.compose.project=${COMPOSE_PROJECT_NAME}" \
    --filter "label=com.docker.compose.service=main" || true)"

  if [ -n "$legacy_main_ids" ]; then
    log "Validating proxy before first migration handoff"
    validate_proxy_config_standalone

    log "Stopping legacy main container before starting proxy on the public port"
    docker stop $legacy_main_ids
    STOPPED_LEGACY_MAIN_IDS="$legacy_main_ids"
  fi

  if ! compose up -d --no-deps proxy; then
    restart_legacy_main "$legacy_main_ids"
    return 1
  fi
  PROXY_STARTED_BY_DEPLOY=1

  if ! compose exec -T proxy nginx -t; then
    compose stop proxy || true
    restart_legacy_main "$legacy_main_ids"
    return 1
  fi
}

remove_legacy_main() {
  legacy_main_ids="$(docker ps -aq \
    --filter "label=com.docker.compose.project=${COMPOSE_PROJECT_NAME}" \
    --filter "label=com.docker.compose.service=main" || true)"

  if [ -n "$legacy_main_ids" ]; then
    docker rm $legacy_main_ids || true
  fi
}

acquire_lock

active_color="$(detect_active_color)"
case "$active_color" in
  blue)
    next_color=green
    ;;
  green)
    next_color=blue
    ;;
  *)
    log "Invalid active color: $active_color"
    exit 1
    ;;
esac

active_service="app_${active_color}"
next_service="app_${next_color}"

log "Deploying $next_service"
compose pull proxy "$next_service"
compose up -d --force-recreate --no-deps "$next_service"

log "Waiting for $next_service to become healthy"
wait_for_healthy "$next_service"

log "Checking that nginx can reach $next_service"
if ! validate_upstream_reachable "$next_service"; then
  print_service_diagnostics "$next_service"
  exit 1
fi

log "Smoke testing $next_service"
if ! validate_upstream_smoke "$next_service"; then
  print_service_diagnostics "$next_service"
  exit 1
fi

render_proxy_conf "$next_service"
install_proxy_conf
if ! reload_or_start_proxy; then
  exit 1
fi

log "Checking proxy after switch"
if ! wait_for_proxy_healthy "$next_service"; then
  rollback_proxy_switch
  print_service_diagnostics proxy
  print_service_diagnostics "$next_service"
  exit 1
fi

log "Smoke testing proxy after switch"
if ! validate_proxy_smoke; then
  rollback_proxy_switch
  print_service_diagnostics proxy
  print_service_diagnostics "$next_service"
  exit 1
fi

log "Smoke testing published proxy port after switch"
if ! validate_published_proxy_smoke; then
  rollback_proxy_switch
  print_service_diagnostics proxy
  print_service_diagnostics "$next_service"
  exit 1
fi

rm -f "${PROXY_CONF}.previous"

printf '%s\n' "$next_color" > "$STATE_FILE"

if [ "$active_service" != "$next_service" ]; then
  log "Draining $active_service for ${DRAIN_SECONDS}s"
  sleep "$DRAIN_SECONDS"
  compose stop "$active_service" || true
fi

remove_legacy_main
log "Deployment switched to $next_service"
