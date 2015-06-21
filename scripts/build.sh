#!/bin/bash

#------------------------------------------------
# Functions & other helpers
#------------------------------------------------

# Print the usage message
function usage {
    echo ""
    echo "usage: build.sh [options]"
    echo ""
    echo "Options:"
    echo " --no-tests       Skip the tests during mvn install."
    echo " -h,--help        Show this message."
    echo ""
}

# Check if Java in the right version is installed
function check_java {
    type java >/dev/null 2>&1
    if [[ $? -ne 0 ]]; then
        echo >&2 "Java is required but it's not installed! Aborting."
        exit 100;
    fi
    local java_version=$(java -version 2>&1 | awk -F '"' '/version/ {print $2}')
    if [[ "$java_version" < "1.8" ]]; then
        echo >&2 "At least Java 8 is required! Aborting."
        exit 101;
    fi
}

# Check if Maven (in the right version) is installed
function check_maven {
    type mvn >/dev/null 2>&1
    if [[ $? -ne 0 ]]; then
        echo >&2 "Maven is required, but it's not installed! Aborting."
        exit 110;
    fi
    local maven_version=$(mvn --version 2>&1 | awk -F ' ' '/Apache Maven/ {print $3}')
    if [[ "$maven_version" < "3.3" ]]; then
        echo >&2 "At least Maven version 3.3 is recommended!"
    fi
}

# Check if Node in the right version is installed
function check_node {
    type node >/dev/null 2>&1
    if [[ $? -ne 0 ]]; then
        echo >&2 "Node.JS is required, but it's not installed! Aborting."
        exit 120;
    fi
    local node_version=$(node --version)
    if [[ "$node_version" < "v0.12" ]]; then
        echo >&2 "At least Node.JS version 0.12 is required! Aborting."
        exit 121;
    fi
}

# Check if Grunt CLI in the right version is installed
function check_grunt {
    type grunt >/dev/null 2>&1
    if [[ $? -ne 0 ]]; then
        echo >&2 "Grunt is required, but it's not installed! Aborting."
        exit 130;
    fi
    local grunt_version=$(grunt --version | awk -F ' ' '{print $2}')
    if [[ "$grunt_version" < "v0.1.13" ]]; then
        echo >&2 "At least Grunt CLI version 0.1.13 is required! Aborting."
        exit 132;
    fi
}

# Check all tool requirements (Java, Node, ...)
function check_requirements {
    check_java
    check_maven
    check_node
    check_grunt
}

# Do the magic for the frontend
function run_npm_and_grunt {
    npm install
    grunt
}

# Run maven install (with or without tests)
function run_maven_install {
    if [[ "$skip_tests" = true ]]; then
        mvn install -Dmaven.test.skip=true
    else
        mvn install
    fi
}


#------------------------------------------------
# Main
#------------------------------------------------

# init. vars
skip_tests=false

# read command line arguments
while [ "$1" != "" ]; do
    case $1 in
        --no-tests )
            skip_tests=true
            ;;
        -h | --help )
            usage
            exit
            ;;
        * )
            echo "Unkown command line argument: $1!"
            usage
            exit 1
    esac
    shift
done

check_requirements

cd main/src/main/webapp
run_npm_and_grunt

cd ../../../..
run_maven_install

exit 0
