![master branch ci](https://github.com/learnlib/alex/actions/workflows/ci.yml/badge.svg?branch=developer)
![version](https://img.shields.io/badge/version-v3.0.0-blue)

<p align="center">
  <img src="backend/src/main/resources/images/logo.png" style="max-width:40%;">
</p>

# ALEX

Automata Learning EXperience (ALEX) is a Web application that allows you run automated tests on web 
applications and JSON-based APIs using active automata learning.

Users model [Selenium][selenium]- or HTTP-based test inputs for their application, which are used to automatically infer 
an automaton model (a [Mealy machine][mealy]), which represents the behavior of the web application.


## Requirements

To run ALEX, install the following software on your machine:

For **Linux / OSX**
* Docker (v20.10.\*) and 
* Docker Compose (v1.28.*) 

For **Windows 10**
* Docker for Windows


## Installation

### Production

**Windows, Linux, Mac (Intel)**

1. [Download](https://github.com/LearnLib/alex/releases/latest) the `docker-compose.alex-3.0.0.yml` file.
2. Run `docker-compose -f docker-compose.alex-3.0.0.yml pull` once.
3. Run `docker-compose -f docker-compose.alex-3.0.0.yml up`.
4. Open `127.0.0.1` in a web browser to access the frontend.

**Mac (ARM)**

1. [Download](https://github.com/LearnLib/alex/releases/latest) the `docker-compose.alex-3.0.0.yml` file.
2. [Download](https://github.com/LearnLib/alex/releases/latest) the `docker-compose.overrides.m1.yml` file.
2. Run `docker-compose -f docker-compose.alex-3.0.0.yml -f docker-compose.overrides.m1.yml pull` once.
3. Run `docker-compose -f docker-compose.alex-3.0.0.yml -f docker-compose.overrides.m1.yml up`.
4. Open `127.0.0.1` in a web browser to access the frontend.

**Services**

| Port | Service            |
|------|--------------------|  
| 80   | Frontend           |
| 8000 | API                |

### Development

**Windows, Linux, Mac (Intel)**

1. Clone the repository.
2. Run `docker-compose -f docker-compose.develop.yml pull`.
3. Run `docker-compose -f docker-compose.develop.yml up`.
4. Open `http://127.0.0.1:4200` in a web browser to access the frontend.

**Mac (ARM)**

1. Clone the repository.
2. Run `docker-compose -f docker-compose.develop.yml -f docker-compose.overrides.m1.yml pull`.
3. Run `docker-compose -f docker-compose.develop.yml -f docker-compose.overrides.m1.yml up`.
4. Open `http://127.0.0.1:4200` in a web browser to access the frontend.

**Services**

| Port | Service                       |
|------|-------------------------------|
| 4200 | Frontend (with live reload)   |
| 8000 | API                           |
| 5005 | API Debug Port                |
| 4444 | Selenium Hub                  |
| 7901 | Chrome VNC (open in browser)  |
| 7901 | Firefox VNC (open in browser) |

For both, the Chrome and the Firefox VNC server, you can use the password `secret`.


## Credentials

After the first start, you can log in as an admin using the account below:

Email: *admin@alex.example* <br>
Password: *admin*


## Further reading

### Documentation

* [User manual](https://learnlib.github.io/alex/book/2.1.0/)
* [Examples](https://learnlib.github.io/alex/book/2.1.0/contents/examples/todomvc/)
* [Developer docs](https://learnlib.github.io/alex/book/2.1.0/contents/dev-docs/development/)

### Background

* [Active automata learning](https://scholar.google.de/scholar?hl=de&q=active+automata+learning)
* [ALEX: Mixed-Mode Learning of Web Applications at Ease](https://link.springer.com/chapter/10.1007/978-3-319-47169-3_51)


## Used libraries

* [LearnLib][learnlib]
* [AutomataLib][automatalib]
* [Selenium][selenium]
* [LTSMin][ltsmin]


[learnlib]: https://github.com/LearnLib/learnlib
[automatalib]: https://github.com/Learnlib/automatalib
[mealy]: https://en.wikipedia.org/wiki/Mealy_machine
[selenium]: https://www.seleniumhq.org/
[ltsmin]: http://ltsmin.utwente.nl/
[docker]: https://www.docker.com/
[docker-compose]: https://docs.docker.com/compose/
