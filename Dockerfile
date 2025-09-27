FROM node:20-alpine

WORKDIR /app
COPY package.json tsconfig.json yarn.lock ./
COPY ./node_modules ./node_modules
COPY ./public ./public
COPY ./src ./src
COPY ./pages ./pages
COPY ./next.config.js ./
RUN yarn build

EXPOSE 3000

CMD yarn start
