FROM node:12 as builder-frontend
WORKDIR /root/workdir
COPY ./frontend/src/main/javascript .
RUN npm ci
RUN npm run build

FROM maven:3 as builder-backend
WORKDIR /root/workdir
COPY . .
COPY --from=builder-frontend /root/workdir/dist ./frontend/target/classes
RUN mvn install package -P !build-frontend

FROM debian as builder-ltsmin
WORKDIR /root/workdir
RUN apt-get update -qq && apt-get upgrade -qq && apt-get install -qq wget
RUN wget http://github.com/utwente-fmt/ltsmin/releases/download/v3.0.2/ltsmin-v3.0.2-linux.tgz
RUN tar -xzf ltsmin-v3.0.2-linux.tgz
RUN mv v3.0.2 ltsmin

FROM openjdk:12
COPY --from=builder-backend /root/workdir/build/target/alex-1.8.0-SNAPSHOT.war /usr/share/java/alex/alex.war
COPY --from=builder-ltsmin /root/workdir/ltsmin /opt/ltsmin
WORKDIR /var/lib/alex
EXPOSE 8000
CMD java -jar /usr/share/java/alex/alex.war --ltsmin.path=/opt/ltsmin/bin
