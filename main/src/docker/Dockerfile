FROM java:8

RUN apt-get update && apt-get install -y --no-install-recommends \
        iceweasel \
        xvfb \
    && rm -rf /var/lib/apt/lists/*

ADD ALEX-*.war /usr/src/alex/ALEX.war
ADD run.sh /usr/src/alex/run.sh
RUN chmod a+x /usr/src/alex/run.sh

WORKDIR /usr/src/alex

ENV DISPLAY :99
EXPOSE 8000

ENTRYPOINT "./run.sh"
