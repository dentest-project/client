FROM node:14-alpine

RUN mkdir -p /usr/nuxt-app
WORKDIR /usr/nuxt-app

RUN apk update && apk upgrade
RUN apk add git

RUN npm install

EXPOSE 3000

ENV NUXT_HOST=0.0.0.0
ENV NUXT_PORT=3000

CMD [ "npm", "run", "dev" ]
