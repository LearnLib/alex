FROM node:18

WORKDIR /var/alex/frontend

COPY package.json package-lock.json ./
RUN npm install

COPY . .
