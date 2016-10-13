#!/usr/bin/env bash

Xvfb :99 -screen 0 1024x768x16 &
java -Dwebdriver.chrome.driver=chromedriver -Dwebdriver.gecko.driver=geckodriver -jar ALEX.war
