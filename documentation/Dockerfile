FROM node:12

WORKDIR /usr/src/docs
RUN mkdir src
COPY src/main/docs ./src
RUN cd src && \
    npm install http-server -g && \
    cp .vuepress/env.docker.js .vuepress/env.default.js && \
    npm install && \
    npm run build
RUN mv src/.vuepress/dist . && \
    rm -rf src

ENTRYPOINT ["http-server", "./dist", "-p", "8080"]
