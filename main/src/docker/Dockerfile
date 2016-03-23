FROM java:8

ADD ALEX-*.war /usr/src/alex/ALEX.war
WORKDIR /usr/src/alex

EXPOSE 8080

ENTRYPOINT ["java", "-jar", "ALEX.war"]

