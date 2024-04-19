FROM node:20-alpine as build

WORKDIR /build

COPY ./ ./

RUN apk update
RUN npm i
RUN npm run build

FROM node:20-alpine

ENV NODE_ENV=production

WORKDIR /home

COPY --from=build /build/dist/index.js ./
COPY --from=build /build/package.json ./
COPY --from=build /build/package-lock.json ./

RUN apk update
RUN npm ci --omit=dev

EXPOSE 8000

CMD [ "node", "index.js" ]
