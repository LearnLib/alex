FROM docker.io/library/node:14-alpine as builder-cli
WORKDIR ./cli
COPY ./package.json ./package.json
COPY ./package-lock.json ./package-lock.json
RUN npm ci
COPY . .
RUN npm run build:image
RUN mv ./dest/.bin/index ./dest/.bin/cli

FROM docker.io/library/alpine:latest
WORKDIR ./cli
COPY --from=builder-cli /cli/dest/.bin/cli ./cli
RUN ls -all
RUN mv /cli/cli /usr/local/bin/alex-cli
