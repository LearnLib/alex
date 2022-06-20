FROM docker.io/library/node:16 as builder
WORKDIR /frontend
COPY ./package.json ./package.json
COPY ./package-lock.json ./package-lock.json
RUN npm install
COPY . .
RUN npm run build:prod

FROM docker.io/library/nginx:stable-alpine
ENV BASE_HREF=/
RUN rm -rf /usr/share/nginx/html/*
COPY --from=builder /frontend/dist/. /usr/share/nginx/html
COPY ./nginx.conf /etc/nginx/nginx.conf
EXPOSE 4200
CMD baseHref=$(echo "${BASE_HREF}" | sed "s/\//\\\\\//g") && \
    # rewrite frontend base url
    sed -i "s/base href=\"\/\"/base href=\"${baseHref}\"/g" /usr/share/nginx/html/index.html && \
    envsubst '$${ALEX_BACKEND_ADDRESS},$${ALEX_BACKEND_PORT}' < /usr/share/nginx/html/assets/config.template.json > /usr/share/nginx/html/assets/config.json && exec nginx -g 'daemon off;'
