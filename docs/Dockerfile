FROM node:14

WORKDIR /usr/src/docs
RUN mkdir src
COPY . ./src
RUN cd src && \
    # Install latest stable version (7.8.0) of npm.
    # The version in the image (6.14.11) leads to errors during the build process.
    npm install -g npm && \
    npm install -g http-server && \
    cp .vuepress/env.docker.js .vuepress/env.default.js && \
    npm ci && \
    npm run build
RUN mv src/.vuepress/dist . && \
    rm -rf src

ENTRYPOINT ["http-server", "./dist", "-p", "8080"]
