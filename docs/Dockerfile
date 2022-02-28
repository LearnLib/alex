FROM docker.io/library/node:16-alpine

WORKDIR /usr/src/docs
RUN mkdir src
COPY . ./src
RUN cd src && \
    npm install -g http-server && \
    cp .vuepress/env.docker.js .vuepress/env.default.js && \
    npm ci && \
    npm run build
RUN mv src/.vuepress/dist . && \
    rm -rf src

ENTRYPOINT ["http-server", "./dist", "-p", "8080"]
