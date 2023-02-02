FROM node:18-alpine

RUN mkdir -p /app
ENV PORT 80

WORKDIR /app

COPY package.json /app
COPY yarn.lock /app

# Production use node instead of root
# USER node

RUN yarn install --production

COPY . /app

RUN yarn add --dev typescript @types/node && yarn build

EXPOSE 80
CMD [ "yarn", "start" ]