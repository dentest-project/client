# Dentest client

Web interface for Dentest. Built with Nuxt.

## Development

```bash
cd docker
docker-compose up --build
```

Access the interface at http://localhost:3000

The legacy API is configured with `API_URL`; Ketal JSON-RPC is configured with
`KETAL_URL` and defaults locally to `http://ketal.dentest.local/rpc`.

Nuxt DevTools is disabled automatically when `HMR_CLIENT_PORT` is set because
that makes its RPC WebSocket cross-origin. Set `NUXT_DEVTOOLS_ENABLED=true` only
when the application and HMR WebSocket are exposed from the same origin.
