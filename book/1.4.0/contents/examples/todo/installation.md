# Installation

## Setup ToDo

In order to setup ToDo, download the archive from [here](../../../assets/files/ToDo.zip) and extract it to an arbitrary location. 
Make sure you have Java JRE or JDK v8 or higher installed. 
Open a terminal, navigate to where the extracted files are located and execute `java -jar ./jetty-runner.jar --port 9090 ./Todo-App.war`. 
Then, open `http://localhost:9090` in a web browser of your choice. 
You should see the login form of ToDo which looks like this:

![Todo Startpage](../../../assets/images/examples/todo/todo-startpage.jpg)

You can login with the default admin account: _admin@admin.de_ as email and _admin_ as password. 
Maybe, login once and play around a little to get a feel of the application before learning it.

## Setup ALEX

To setup alex, in the terminal, navigate to where the [ALEX-\*.\*.war][1] is located and execute `java -jar alex.war --port 8000`,
wait a moment and open `http://localhost:8000` in a web browser. 
You should see the index page where you are asked to login or create a new account.

![Welcome Screen](../../../assets/images/examples/todo/welcome_screen.jpg)

## Login

![Login Process](../../../assets/images/examples/todo/login_process.jpg)

Create a new account or alternatively authenticate with the admin account using _admin@alex.example_ as email and _admin_ as password.
Press the login-button to finish the login process which leads to the projects overview on success.

![Dashboard](../../../assets/images/examples/todo/home_empty.jpg)

[1]: https://github.com/LearnLib/alex/releases/download/v1.0/ALEX-1.0.war