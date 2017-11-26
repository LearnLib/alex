FROM java:8

# Set our working driectory for the rest of this files
WORKDIR /usr/src/alex

# Install Firefox and Chrome, with all the needed deepencies,
# including the Chrome Driver and the Marionette / Gecko Driver for Selenium.
# This also includes the Xvfb to run them both in a headless mode.
RUN apt-get update && apt-get install -y --no-install-recommends \
        chromium \
        iceweasel \
        xvfb \
    && rm -rf /var/lib/apt/lists/*e

ADD chromedriver chromedriver
ADD geckodriver geckodriver


# Finally add ALEX and our startup script.
ADD ALEX-*.war ALEX.war

ADD run.sh run.sh
RUN chmod a+x run.sh


# Last refinements to the envoirment and the image.
ENV DISPLAY :99
ENV WEBDRIVER.CHROME.DRIVER chromedriver
ENV WEBDRIVER.GECKO.DRIVER  geckodriver

EXPOSE 8000


# here we go
ENTRYPOINT "./run.sh"
