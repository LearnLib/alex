# Installation (Docker)

## Required Software

In order to use ALEX on your local machine using Docker, make sure the following software is installed:

**Linux**
- Docker (v20.10.\*) and 
- Docker Compose (v1.28.*) 

**Windows / Mac**
- Docker for Windows

## Installation

**Windows / Linux / Mac (Intel)**

1. [Download][download]  the `docker-compose.alex-3.0.0.yml` file.
2. Run `docker-compose -f docker-compose.alex-3.0.0.yml up`.
3. Wait until the command line prints something like `Started App in XX.XXX seconds`.
4. Open [http://127.0.0.1](http://127.0.0.1) in a web browser to access the frontend.

**Mac (ARM)**

1. [Download][download]  the `docker-compose.alex-3.0.0.yml` file.
2. [Download][download]  the `docker-compose.overrides.m1.yml` file.
3. Run `docker-compose -f docker-compose.alex-3.0.0.yml -f docker-compose.overrides.m1.yml up`.
4. Wait until the command line prints something like `Started App in XX.XXX seconds`.
5. Open [http://127.0.0.1](http://127.0.0.1) in a web browser to access the frontend.

## Credentials

After the first start, you can log in as an admin using the account below:

Email: *admin@alex.example* <br>
Password: *admin*

[download]: https://github.com/LearnLib/alex/releases
