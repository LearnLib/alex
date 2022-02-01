# Installation

In order to use ALEX on your local machine, make sure the following software is installed:

For **Linux / OSX**
- Docker (v20.10.\*) and 
- Docker Compose (v1.28.*) 

For **Windows 10**
- Docker for Windows

## Using the latest Docker Compose file

**Windows, Linux, Mac (Intel)**

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

After the first start, you can log in as an admin using the account below:

Email: *admin@alex.example* <br>
Password: *admin*


## From source

1. Clone the repository `git clone https://github.com/LearnLib/alex.git`
2. Navigate to the directory `cd alex`

For the **production** environment:

3. Run `docker-compose -f docker-compose.production.yml up`
4. Open [http://127.0.0.1](http://127.0.0.1) in a Web browser.

For the **development** environment:

3. Run `docker-compose -f docker-compose.development.yml up`
4. Open [http://127.0.0.1:4200](http://127.0.0.1:4200) in a Web browser.

[download]: https://github.com/LearnLib/alex/releases
