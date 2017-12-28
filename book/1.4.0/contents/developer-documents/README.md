# Developer docs

Here we present some notes that might be useful for developers.


## Setting up ALEX for development

Make sure your machine has the following software installed:

1. Java JDK 8 or greater
2. Node.js v7.9.* or higher
3. Git
4. Maven 3.3.*

Clone the repository and install the frontend dependencies.

```bash
# clone the repository
git clone https://github.com/LearnLib/alex.git

# install frontend dependencies
cd alex/frontend/src/main/javascript
npm install

# install backend dependencies
cd ../../../../backend
mvn install [-DskipTests]
```

You are done! Add the optional parameter *-DskipTests* in order to skip the execution of tests.


## Testing ALEX

| Command                   | Description                                                 |
|---------------------------|-------------------------------------------------------------|
| `mvn test`                | Execute all backend unit tests                              |
| `mvn checkstyle:check`    | Check if the code style is according to the specifications  |


## Building a release

To build a packaged version of ALEX from the source, navigate to the root folder of the repository and enter the following command in the terminal:

```bash
mvn clean package [-DskipTests]
```

Afterwards, the *ALEX-build-X.X.X.war* archive is created in the `build/target` directory.


## Command line arguments

| Argument          | Description                                                                                                                                                       |
|-------------------|-------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| `alex.dbpath`     | The path where the HSQL DB is stored. <br> `java -jar ALEX-1.4.0.war --alex.dbpath=mem:testdb` respectively <br>  `mvn spring-boot:run "-Dalex.dbpath=mem:testdb"`|
| `alex.port`       | The path where ALEX should run <br> `java -jar ALEX-1.4.0.war --alex.port=8000` respectively `mvn spring-boot:run "-Dalex.port=8000"`                             |
| `chromeDriver`    | The absolute path to the Chrome driver executable on your system                                                                                                  |
| `edgeDriver`      | The absolute path to the Edge driver executable on your system                                                                                                    |
| `firefoxDriver`   | The absolute path to the Gecko driver executable on your system                                                                                                   |
| `remoteDriver`    | The URI to the remote Selenium server                                                                                                                             |

## Deploy with Docker

Another way to test and/or release ALEX involves [Docker][docker].
Make sure that Docker is installed on your machine and that you have the right permissions to use it.
Then, execute the following commands from the root of the repository to create a docker image:

```bash
# must be executed once
mvn install [-DskipTests]

# build the image
cd build
mvn docker:build
```

Afterwards a Docker image is created and you use it like any other Docker image, e.g.

```bash
# lets take a look at all images
docker images

# run ALEX at http://localhost:8000
docker run -d -p 8000:8080 alex:1.X.X-SNAPSHOT
```

The corresponding *Dockerfile* can be found at */build/src/docker*

## Frontend development

The frontend is developed with [AngularJS][angular] and uses es6 features using the babel transpiler.
Styling ALEX is done with [Bootstrap v3][bootstrap] and custom sass stylesheets.
All frontend files can be found in *frontend/src/main/javascript*.

### Requirements

* node.js v7.9.* or higher

### NPM commands

There are several NPM commands to automate the development workflow.
In the *frontend/src/main/javascript* directory, use the following commands:

| Command          | Description                                                                              |
|------------------|------------------------------------------------------------------------------------------|
| `npm run build`  | Build all the application files                                                          |
| `npm run serve`  | Serves the frontend at *http://localhost:8080*. <br> For a custom port, add `-- -p XXXX` |
| `npm run dev`    | Compile sass, html and js files every time their content changes                         |
| `npm test`       | Execute all unit tests                                                                   |

### Running the frontend

Since the frontend and the backend are decoupled from each other, we have to configure the address of the backend, so
that all HTTP requests go to the correct server. Under *javascript/src/main/javascript*, there is a file called *env.js*
which contains the following lines:

```javascript
    window.__env.apiUrl = '/rest';
    // window.__env.apiUrl = 'http://localhost:8000/rest';
```

For the local development, uncomment the second line and adjust the port where the backend is running on.
If you want to build ALEX later, the variable has to point to */rest* again.

## Authentication with the REST API

At the moment, the REST interface supports authentication via [JSON Web Tokens (JWT)][jwt].

1. Make a `POST` request to `/rest/users/login` with a HTTP body that contains a serialized user object which looks like `{"email":"<yourEmail>", "password":"<yourPassword>"}`.
2. You should receive a base64 encoded JWT. Save it somewhere and send it with each HTTP request to the API in the HTTP-Authorization header as follows: `Authorization: Bearer <theEncodedToken>`

The token provides information about the user as a base64 encoded JSON object as payload.
It looks like `{"email": "<yourEmail>", "id": <ID> "role": "<ROLE>"}` where the role is either *ADMIN* or *REGISTERED*.

That's it. Currently, the password is transferred in plain text since there is no HTTPS connection available.


[angular]: https://angularjs.org/
[bootstrap]: https://getbootstrap.com/docs/3.3/
[docker]: https://www.docker.com
[jwt]: http://jwt.io/