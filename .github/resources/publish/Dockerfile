#syntax=docker/dockerfile:1.4

FROM node:lts AS app_main

ENV NODE_ENV=production
ENV NODE_OPTIONS="--openssl-legacy-provider"
ENV HOST="0.0.0.0"

WORKDIR /srv/app

COPY --link . .
COPY --link docker/node/prod/docker-entrypoint.sh /usr/local/bin/docker-entrypoint

RUN npm install
RUN rm -Rf docker
RUN chmod +x /usr/local/bin/docker-entrypoint

ENTRYPOINT ["docker-entrypoint"]

EXPOSE 3000
