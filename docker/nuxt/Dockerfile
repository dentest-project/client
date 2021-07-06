FROM node:14-alpine

RUN mkdir -p /usr/nuxt-app
WORKDIR /usr/nuxt-app

RUN apk update && apk upgrade
RUN apk add git python make g++

COPY package.json .
COPY package-lock.json .

RUN npm install

CMD npm install && npm run dev
