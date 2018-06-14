<p align="center">
    <img src="src/main/resources/images/logo.png" style="max-width:100%;">
</p>

# ALEX

[![Travis CI](https://travis-ci.org/LearnLib/alex.svg?branch=developer)](https://travis-ci.org/LearnLib/alex)

Automata Learning EXperience (ALEX) is an extension of [LearnLib][learnlib] that allows you run automated tests on web 
applications and JSON-based REST APIs using active automata learning.

Users model [Selenium][selenium]- or HTTP-based test inputs for their application, which are used to automatically infer 
an automaton model (a [Mealy machine][mealy]), which represents the behavior of the web application.

## Installation

Make sure you have Java 8 installed on your system.
We advise to use a modern web browser like Google Chrome, Mozilla Firefox or Microsoft Edge with JavaScript enabled.

1. [Download](https://github.com/LearnLib/alex/releases/latest) the latest version.
2. Open a terminal and start ALEX via `java -jar alex-1.5.1.war [--alex.port=XXXX]`.
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

The bundle can then be found at `build/target/alex-build-1.5.1.war`.

## Further reading

* [User manual](http://learnlib.github.io/alex/book/1.5.0/contents/user-manual/index.html)
* [Examples](http://learnlib.github.io/alex/book/1.5.0/contents/examples/index.html)
* [Developer docs](http://learnlib.github.io/alex/book/1.5.0/contents/developer-documents/index.html)
* [Active automata learning](https://scholar.google.de/scholar?hl=de&q=active+automata+learning)
* [LearnLib](http://learnlib.de/)


[learnlib]: https://github.com/LearnLib/learnlib
[mealy]: https://en.wikipedia.org/wiki/Mealy_machine
[selenium]: https://www.seleniumhq.org/
