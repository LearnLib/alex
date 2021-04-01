FROM node:14

WORKDIR /usr/src/docs
RUN mkdir src
COPY . ./src
RUN cd src && \
    npm install webpack && \
    npm install http-server -g && \
    cp .vuepress/env.docker.js .vuepress/env.default.js && \
    npm install && \
    npm run build
RUN mv src/.vuepress/dist . && \
    rm -rf src

ENTRYPOINT ["http-server", "./dist", "-p", "8080"]
