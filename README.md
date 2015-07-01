Automata Learning Experience (ALEX)
===================================

Getting Started
---------------
To build ALEX [Java][], [Maven][], [Node.JS][nodejs] and the [Grunt CLI][grunt] must be installed.
If all this tools are available, the fastest and easiest way to get started is to run the following commands:

    # the next line must only be done once!
    mvn install

    # start the server
    cd main
    mvn jetty:run

These commands will download all required dependencies and then build ALEX.
If the build process was successful and the server has started, ALEX is available
at [localhost](http://localhost:8080/).


Building a Release
------------------
To create a release archive please make sure that all requirements are fulfilled and that you can successfully build
ALEX. If this is the case just run:

    mvn clean package
    mvn site assembly:single -P release

Afterwards the *ALEX-xxx.tar.gz* archive is created in the `target` directory.

Docker
------
Another way to test and / or release ALEX involves the tool [Docker](https://www.docker.com).
Please make sure that Docker is installed on your machine and that you have the right permissions to use it.
If this is the case just run:

    # the next line must only be done once!
    mvn install
    
    cd main
    mvn docker:build

Afterwards a new Docker image is created and you use it like any other Docker image, e.g.
    
    # lets take a look at all images
    docker images
    
    # run ALEX at http://localhost:8000
    docker run -d -p 8000:8080 alex:1.0-SNAPSHOT

More Documentation
------------------
Further documentation is provided through the *site* feature of maven.
To Create the documentation simply run:

    mvn site

Afterwards the documentation is in the `target/site` folders of every module.


Maintainers
-----------

* [Alexander Bainczyk](mailto:alexander.bainczyk@tu-dortmund.de)
* [Alexander Schieweck](mailto:alexander.schieweck@tu-dortmund.de)


[java]:   https://java.com
[maven]:  https://maven.apache.org
[nodejs]: https://nodejs.org
[grunt]:  http://gruntjs.com
