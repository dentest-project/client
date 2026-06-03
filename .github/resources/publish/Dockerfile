#syntax=docker/dockerfile:1.4

ARG NODE_VERSION=24
FROM node:${NODE_VERSION}-bookworm AS app_main

ARG API_URL
ENV NODE_ENV=production
ENV NODE_OPTIONS="--openssl-legacy-provider"
ENV HOST="0.0.0.0"
ENV API_URL="${API_URL}"

WORKDIR /srv/app

COPY --link . .
COPY --link docker/node/prod/docker-entrypoint.sh /usr/local/bin/docker-entrypoint

RUN test -n "$API_URL"
RUN npm install
RUN npm run build
RUN rm -Rf docker
RUN chmod +x /usr/local/bin/docker-entrypoint

ENTRYPOINT ["docker-entrypoint"]

EXPOSE 3000
