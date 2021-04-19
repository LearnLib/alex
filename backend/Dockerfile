FROM maven:3.8 as builder-backend
RUN mkdir -p /backend
WORKDIR /backend
COPY . /backend
RUN mvn install package -DskipTests

FROM debian as builder-ltsmin
RUN mkdir -p /ltsmin
WORKDIR /ltsmin
RUN apt-get update -qq && apt-get upgrade -qq && apt-get install -qq wget
RUN wget https://github.com/utwente-fmt/ltsmin/releases/download/v3.0.2/ltsmin-v3.0.2-linux.tgz
RUN tar -xzf ltsmin-v3.0.2-linux.tgz
RUN mv v3.0.2 ltsmin

FROM openjdk:15
COPY --from=builder-backend /backend/target/ALEX-2.1.0.jar /usr/share/java/alex/alex.jar
COPY --from=builder-ltsmin /ltsmin/ltsmin /opt/ltsmin
WORKDIR /var/lib/alex

EXPOSE 8000

CMD java -jar /usr/share/java/alex/alex.jar --ltsmin.path=/opt/ltsmin/bin --webdriver.remote.url=${REMOTE_DRIVER}