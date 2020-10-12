FROM node:12 as builder
WORKDIR /root/workdir
COPY . .
# The project is packed first to prevent the working directory from simply
# being symlinked into the global node_modules directory
RUN npm pack
RUN npm install --global alex-cli-*.tgz
RUN ln -s ../lib/node_modules/alex-cli/alex-cli.js /usr/local/bin/alex-cli
