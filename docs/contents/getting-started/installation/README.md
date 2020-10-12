# Installation

In order to use ALEX on your system, make sure that **Java 8** or **Java 11** is installed.
Further, a **modern browser** like Google Chrome, Mozilla Firefox or Microsoft Edge with JavaScript enabled is required to use the web interface.


## Bundled version

1. [Download][download] the latest version.
2. Open a terminal and start ALEX via `java -jar alex-2.0.0.war`.
3. Wait until the command line prints something like `Started App in XX.XXX seconds`.
3. Open *http://localhost:8000* in a web browser.

After the first start, you can login as an admin using the account below:

Email: *admin@alex.example* <br>
Password: *admin*


## From source

In order to build ALEX from source, make sure that you have the following software installed:

* Java JDK 11
* Maven 3
* Node.js (v12) and the NPM (v6)

To build ALEX, open a terminal and follow the instructions below:

```bash
# clone the repository
git clone https://github.com/LearnLib/alex.git

# navigate to the project directory
cd alex

# build ALEX
mvn install package [-DskipTests]
```

The bundle can then be found at `build/target/alex-2.0.0.war`.
Run it using the instructions for running the bundled version from above.

[download]: https://github.com/LearnLib/alex/releases/download/v2.0.0/alex-2.0.0.war