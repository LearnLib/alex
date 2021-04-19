FROM node:14
WORKDIR /root/workdir
COPY . .
# The project is packed first to prevent the working directory from simply
# being symlinked into the global node_modules directory
RUN npm pack
RUN npm install --global alex-cli-*.tgz
