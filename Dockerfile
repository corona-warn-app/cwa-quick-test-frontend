FROM node:lts as build

COPY public ./public
COPY src ./src
COPY package.json .
COPY tsconfig.json .
COPY yarn.lock .

RUN yarn && yarn build

FROM nginx:alpine

COPY --from=build ./build /usr/share/nginx/html

EXPOSE 80 443
