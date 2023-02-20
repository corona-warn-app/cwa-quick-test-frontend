FROM node:18-bullseye as build

WORKDIR /

COPY public ./public
COPY src ./src
COPY package.json tsconfig.json yarn.lock* config-overrides.js ./

RUN yarn && yarn build

FROM nginx:alpine

COPY --from=build ./build /usr/share/nginx/html

EXPOSE 80 443
