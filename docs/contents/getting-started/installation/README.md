# Installation

In order to use ALEX on your local machine, make sure that 

- Docker (v20.10.\*) and 
- Docker Compose (v1.28.*) 

are installed.


## Using the latest Docker Compose file

1. [Download][download] the latest `docker-compose.deploy.yml` file.
2. Open a terminal and start ALEX via `docker-compose -f docker-compose.deploy.yml`.
3. Wait until the command line prints something like `Started App in XX.XXX seconds`.
4. Open [http://127.0.0.1](http://127.0.0.1) in a modern Web browser.

After the first start, you can login as an admin using the account below:

Email: *admin@alex.example* <br>
Password: *admin*


## From source

1. Clone the repository `git clone https://github.com/LearnLib/alex.git`
2. Navigate to the directory `cd alex`
3. Run `docker-compose -f docker-compose.deploy.yml`
4. Open [http://127.0.0.1:4200](http://127.0.0.1:4200) in a modern Web browser.


[download]: https://github.com/LearnLib/alex/releases