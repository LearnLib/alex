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

## Documentation

* [User manual](https://learnlib.github.io/alex/book/3.0.0/)
* [Installation](https://learnlib.github.io/alex/book/3.0.0/contents/getting-started/installation/)
* [Examples](https://learnlib.github.io/alex/book/3.0.0/contents/examples/todomvc/)
* [Developer docs](https://learnlib.github.io/alex/book/3.0.0/contents/dev-docs/development/)

## Background

* [Active automata learning](https://scholar.google.de/scholar?hl=de&q=active+automata+learning)
* [ALEX: Mixed-Mode Learning of Web Applications at Ease](https://link.springer.com/chapter/10.1007/978-3-319-47169-3_51)

[mealy]: https://en.wikipedia.org/wiki/Mealy_machine
[selenium]: https://www.seleniumhq.org/
