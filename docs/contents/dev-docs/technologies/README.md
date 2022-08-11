# Technologies

## Frontend

Make sure you have the following software installed on your development machine:

- Node.js v16 and NPM v8

The frontend is developed with [Angular][angular], relies on the Angular CLI and is written in Typescript.
Styling in ALEX is done with [Bootstrap v4][bootstrap] and SASS stylesheets.
All frontend files can be found in *frontend/src/main/javascript*.

## Backend

Make sure you have the following software installed on your development machine:

- Java JDK 17
- Maven 3.8.*

### Maven goals

Make sure you `mvn install`ed ALEX once before executing any of the following commands.

| Command                                 | Description                                                          |
|-----------------------------------------|----------------------------------------------------------------------|
| `mvn test`                              | Execute all backend unit tests.                                      |
| `mvn verify`                            | Execute all backend unit and integration tests.                      |
| `mvn checkstyle:check -Pcode-analysis`  | Check if the code style is according to the specifications.          |
| `mvn spotbugs:check -Pcode-analysis`    | Execute static code analysis with Spotbugs.                          |
| `mvn spring-boot:run`                   | Start the REST API of ALEX.                                          |
