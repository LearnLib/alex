FROM openjdk:8

# Set the working driectory for the rest of this file
WORKDIR /usr/src/alex

# Install Chrome, Firefox and other required dependencies
RUN apt update && apt install -y --no-install-recommends \
        chromium \
        iceweasel \
        xvfb \
        unzip \
        libgconf-2-4 \
    && rm -rf /var/lib/apt/lists/*e

# Install latest version of Firefox since debian is stuck on Firefox-esr
# According to https://linuxconfig.org/how-to-install-latest-firefox-browser-on-debian-9-stretch-linux
RUN wget -O FirefoxSetup.tar.bz2 "https://download.mozilla.org/?product=firefox-latest&os=linux64&lang=en-US" \
    && mkdir /opt/firefox \
    && tar xjf FirefoxSetup.tar.bz2 -C /opt/firefox/ \
    && mv /usr/lib/firefox-esr/firefox-esr /usr/lib/firefox-esr/firefox-esr_orig \
    && ln -s /opt/firefox/firefox/firefox /usr/lib/firefox-esr/firefox-esr \
    && rm FirefoxSetup.tar.bz2

# Add ALEX
ADD ./alex-*.war alex.war

# Get the latest Chrome driver
RUN wget "https://chromedriver.storage.googleapis.com/2.33/chromedriver_linux64.zip" \
    && unzip chromedriver_linux64.zip -d ./ \
    && chmod +x chromedriver \
    && rm chromedriver_linux64.zip

# Get the latest Firefox driver
RUN wget "https://github.com/mozilla/geckodriver/releases/download/v0.19.1/geckodriver-v0.19.1-linux64.tar.gz" \
    && tar -xf geckodriver-v0.19.1-linux64.tar.gz \
    && chmod +x geckodriver \
    && rm geckodriver-v0.19.1-linux64.tar.gz

# Set the environment variable for a virtual display
ENV DISPLAY :99

# Run a virtual display with full hd resolution
RUN Xvfb :99 -screen 0 1920x1080x16 &

# Per default, ALEX runs on port 8000
EXPOSE 8000

# Execute ALEX
ENTRYPOINT java -jar alex.war "--chromeDriver=/usr/src/alex/chromedriver" "--geckoDriver=/usr/src/alex/geckodriver"
