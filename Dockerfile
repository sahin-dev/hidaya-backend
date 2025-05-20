FROM node:22-alpine

WORKDIR /app

COPY package*.json .

RUN yarn install --frozen-lockfile

EXPOSE 5012

COPY . .

CMD [ "yarn", "dev" ]