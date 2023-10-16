FROM node:16-alpine

WORKDIR /usr/src/app

COPY package*.json .

RUN npm install --legacy-peer-deps

COPY . .

#To avoid "Invalid Host header" when accessing localhost:8080
ENV DANGEROUSLY_DISABLE_HOST_CHECK=true

EXPOSE 5000

CMD ["npm", "run", "start"]