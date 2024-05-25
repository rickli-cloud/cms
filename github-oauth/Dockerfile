FROM node:20-alpine

ENV NODE_ENV=production

WORKDIR /home

COPY ./dist/index.js .
COPY ./package.json .
COPY ./package-lock.json .

RUN apk update
RUN npm ci --omit=dev

EXPOSE 8000

CMD [ "node", "index.js" ]
