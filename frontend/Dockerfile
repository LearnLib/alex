FROM node as builder
RUN mkdir -p /frontend
WORKDIR /frontend
COPY package.json /frontend
RUN npm install
COPY . /frontend
RUN npm run build:prod

FROM nginx:stable-alpine
RUN rm -rf /usr/share/nginx/html/*
COPY --from=builder /frontend/dist/. /usr/share/nginx/html
COPY ./nginx.conf /etc/nginx/nginx.conf
CMD envsubst '$${SERVER_ADDRESS},$${PORT}' < /usr/share/nginx/html/assets/config.template.json > /usr/share/nginx/html/assets/config.json && exec nginx -g 'daemon off;'