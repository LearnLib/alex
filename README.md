<p align="center">
    <img src="src/main/resources/images/logo.png" style="max-width:100%;">
</p>

# ALEX

[![Travis CI](https://travis-ci.org/LearnLib/alex.svg?branch=developer)](https://travis-ci.org/LearnLib/alex)
[![Coverage Status](https://coveralls.io/repos/github/LearnLib/alex/badge.svg?branch=developer)](https://coveralls.io/github/LearnLib/alex?branch=master)

Automata Learning EXperience (ALEX) is an extension of [LearnLib][learnlib] that allows you run automated tests on web 
applications and JSON-based REST APIs using active automata learning.

Users model [Selenium][selenium]- or HTTP-based test inputs for their application, which are used to automatically infer 
an automaton model (a [Mealy machine][mealy]), which represents the behavior of the web application.

## Installation

Make sure you have Java 8 installed on your system.
We advise to use a modern web browser like Google Chrome, Mozilla Firefox or Microsoft Edge with JavaScript enabled.

1. [Download](https://github.com/LearnLib/alex/releases/latest) the latest version.
2. Open a terminal and start ALEX via `java -jar alex-1.6.1.war [--server.port=XXXX]`.
3. Wait until the command line prints something like `de.learnlib.alex.App - Started App in XX.XXX seconds`.
3. Open *http://localhost:8000* in a web browser.

After the first start, you can login as an admin using the account below:

Email: *admin@alex.example* <br>
Password: *admin*

## Build instructions

In order to build ALEX from source make sure your system matches the following requirements:

* Java JDK 8
* Maven 3
* Node.js (v10.0.0) and the NPM (v6.0.0)

To build ALEX, open a terminal and follow the instructions below:

```bash
# clone the repository
git clone https://github.com/LearnLib/alex.git

# navigate to the project directory
cd alex

# build ALEX
mvn install package [-DskipTests]
```

The bundle can then be found at `build/target/alex-build-1.6.1.war`.

## Connecting to a database

Per default, ALEX uses an embedded HSQL database which is stored in the *target/alex-database* directory.
You can however also connect ALEX to a MySQL 5.7 database.
Other databases have not been tested yet.

### MySQL

Create a file called *application.properties* and add the following contents (and change the values according to your setup):

```
# application.properties
spring.datasource.url=jdbc:mysql://localhost:3306/alex
spring.datasource.username=root
spring.datasource.password=root
spring.jpa.hibernate.ddl-auto=update
```

Then, start ALEX like this:

`java -jar alex-1.6.1.war "--spring.config.location=/path/to/your/application.properties"`


## Using LTSMin

ALEX uses the external [LTSMin][ltsmin] library for model checking.
If you want to use its capabilities, download version **3.0.2** and append the `ltsminBinDir` argument to the ALEX binary on start.
The value for the argument should be the *bin* directory where the compiled binaries of LTSMin are located.
Example:

`java -jar alex-1.6.0.war --ltsminBinDir="/path/to/ltsmin/bin"`



## Further reading

* [User manual](http://learnlib.github.io/alex/book/1.5.0/contents/user-manual/index.html)
* [Examples](http://learnlib.github.io/alex/book/1.5.0/contents/examples/index.html)
* [Developer docs](http://learnlib.github.io/alex/book/1.5.0/contents/developer-documents/index.html)
* [Active automata learning](https://scholar.google.de/scholar?hl=de&q=active+automata+learning)
* [LearnLib](http://learnlib.de/)


[learnlib]: https://github.com/LearnLib/learnlib
[mealy]: https://en.wikipedia.org/wiki/Mealy_machine
[selenium]: https://www.seleniumhq.org/
[ltsmin]: http://ltsmin.utwente.nl/
