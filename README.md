<p align="center">
    <img src="src/main/resources/images/logo.png" style="max-width:100%;">
</p>

# ALEX

[![Travis CI](https://travis-ci.org/LearnLib/alex.svg?branch=developer)](https://travis-ci.org/LearnLib/alex)

Automata Learning Experience (ALEX) is an extension of the [LearnLib](https://github.com/LearnLib/learnlib) that allows 
you run automated tests on web applications and JSON-based REST APIs using active automata learning.

Users model basic test inputs for their target application which are used by ALEX to automatically infer an automaton 
model, or to be more precise, a [Mealy machine](https://en.wikipedia.org/wiki/Mealy_machine) that represents the 
behavior of the web application.

## Installation and login

We developed and tested ALEX using either Windows 8.1 and higher and Linux Ubuntu 14.10 and higher.
As the application runs on JAVA, any other system with an installed JVM should do fine.
We also advise to use a modern web browser like Google Chrome, Mozilla Firefox or Microsoft Edge with JavaScript enabled.

After the first start, you can login as an admin using the account below.

Email: *admin@alex.example* <br>
Password: *admin*

#### Using the packaged version

Make sure you have Java 8 installed on your system.

1. Download the latest version. [Download](https://github.com/LearnLib/alex/releases/latest)
2. Open a terminal and start the *war* archive using `java -jar ALEX.war [--port=XXXX]`
3. Open *http://localhost:8000* in a web browser

#### From source

For the installation from the source files make sure your system matches the following requirements:

* Java JDK 8
* Maven 3
* Node.js (v10.0.0) and the NPM (v6.0.0)

ALEX currently relies on snapshot versions of [AutomataLib](https://github.com/LearnLib/automatalib) and [LearnLib](https://github.com/LearnLib/leanrlib).
Follow the build instructions for local development of both libraries and then proceed with the following steps.

To obtain ALEX execute the following commands in a directory of your choice:

1. `git clone https://github.com/LearnLib/alex.git`
2. `cd alex`

Afterwards you can build and run ALEX by running following commands:

1. `mvn clean package [-DskipTests]`
2. `java -jar build/target/ALEX/*war [--alex.port=XXXX]`
3. open *http://localhost:8000* in a web browser

Or, if you just want to start the backend, you can use:

1. `cd main`
2. `mvn spring-boot:run [-Dalex.port=XXXX]`
3. open *http://localhost:8000* in a web browser


## Further reading

* [User manual](http://learnlib.github.io/alex/book/1.4.0/contents/user-manual/index.html)
* [Examples](http://learnlib.github.io/alex/book/1.4.0/contents/examples/index.html)
* [Developer docs](http://learnlib.github.io/alex/book/1.4.0/contents/developer-documents/index.html)
* [Active automata learning](https://scholar.google.de/scholar?hl=de&q=active+automata+learning)
* [LearnLib](http://learnlib.de/)
