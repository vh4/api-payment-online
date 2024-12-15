FROM node:18-alpine

RUN apk add --no-cache tzdata
ENV TZ=Asia/Jakarta
RUN cp /usr/share/zoneinfo/$TZ /etc/localtime && echo $TZ > /etc/timezone

WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
COPY envfile .env

RUN npm run build

ENV NODE_ENV=production

ENTRYPOINT ["npm", "start"]