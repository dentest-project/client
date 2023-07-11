#syntax=docker/dockerfile:1.4

# Prod image
FROM node:lts AS app_node

ENV NODE_ENV=production
ENV NODE_OPTIONS=--openssl-legacy-provider

WORKDIR /srv/app

# copy sources
COPY --link . .

RUN NODE_ENV=development npm install
RUN rm -Rf docker/
RUN NODE_ENV=development npm run build

COPY --link docker/node/prod/docker-entrypoint.sh /usr/local/bin/docker-entrypoint
RUN chmod +x /usr/local/bin/docker-entrypoint

ENTRYPOINT ["docker-entrypoint"]

# Dev image
FROM app_node AS app_node_dev

ENV NODE_ENV=development

COPY --link docker/node/docker-entrypoint.sh /usr/local/bin/docker-entrypoint
RUN chmod +x /usr/local/bin/docker-entrypoint

ENTRYPOINT ["docker-entrypoint"]
