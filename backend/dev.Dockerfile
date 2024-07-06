FROM maven:3.8-openjdk-17

WORKDIR /var/alex/backend

COPY ./pom.xml ./pom.xml
RUN mvn verify -DskipTests

COPY . .
