FROM docker.io/library/maven:3.8-openjdk-17-slim as builder-backend
RUN mkdir -p /backend
WORKDIR /backend
COPY . /backend
RUN mvn install package -DskipTests

FROM docker.io/library/debian:buster-slim as builder-ltsmin
RUN mkdir -p /ltsmin
WORKDIR /ltsmin
RUN apt-get update -qq && apt-get upgrade -qq && apt-get install -qq wget
RUN wget https://github.com/utwente-fmt/ltsmin/releases/download/v3.0.2/ltsmin-v3.0.2-linux.tgz
RUN tar -xzf ltsmin-v3.0.2-linux.tgz
RUN mv v3.0.2 ltsmin

FROM docker.io/library/openjdk:17-slim
COPY --from=builder-backend /backend/target/ALEX-3.0.0-SNAPSHOT-exec.jar /usr/share/java/alex/alex.jar
COPY --from=builder-ltsmin /ltsmin/ltsmin /opt/ltsmin
WORKDIR /var/lib/alex

EXPOSE 8000

CMD java -jar /usr/share/java/alex/alex.jar \
    --ltsmin.path=/opt/ltsmin/bin \
    --selenium.grid.host=selenium-hub \
    --selenium.grid.port=4444
