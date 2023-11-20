# `template-node-express`

A minimal production-ready node HTTP server with [`Express`](https://expressjs.com/) and Typescript.

✅ Typescript \
✅ Graceful shutdown \
✅ Tracing with OpenTelemetry \
✅ Trust proxy \
✅ Structured logging with [`pino`](https://github.com/pinojs/pino) \
✅ Rich request logging middleware including request id, trace id, context propagation, and more \
✅ Testing with [`jest`](https://github.com/jestjs/jest) and [`supertest`](https://github.com/ladjs/supertest) \
✅ [`helmet`](https://github.com/helmetjs/helmet) & [`compression`](https://github.com/expressjs/compression)

[![Deploy on Railway](https://railway.app/button.svg)](https://railway.app/template/KwYYFA?referralCode=ToZEjF)

## Installation

```sh
git clone https://github.com/dillonstreator/template-node-express

cd template-node-express

yarn install

yarn dev
```

## Configuration

See all example configuration via environment variables in [`.env-example`](./.env-example)

### Open Telemetry

Open Telemetry is disabled by default but can be enabled by setting the `OTEL_ENABLED` environment to `true`.

By default, the trace exporter is set to standard output. This can be overridden by setting `OTEL_EXPORTER_OTLP_ENDPOINT`.

Start the `jaegertracing/all-in-one` container with `docker-compose up` and set `OTEL_EXPORTER_OTLP_ENDPOINT=http://localhost:4318` to collect logs in jaeger. Docker compose will expose jaeger at http://localhost:16686