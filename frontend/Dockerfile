FROM node:12.19.0 as builder
WORKDIR /frontend
COPY . .
RUN npm ci
RUN npm run build:prod

FROM nginx:stable-alpine
RUN rm -rf /usr/share/nginx/html/*
COPY --from=builder /frontend/dist/. /usr/share/nginx/html
COPY ./nginx.conf /etc/nginx/nginx.conf

EXPOSE 4200

CMD envsubst '$${SERVER_ADDRESS},$${PORT}' < /usr/share/nginx/html/assets/config.template.json > /usr/share/nginx/html/assets/config.json && exec nginx -g 'daemon off;'
