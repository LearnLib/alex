# Best practices

In this section, some of the best practices for using ALEX are written down. 
These rely on our own experiences while modeling and learning several web applications.


## Symbol modeling

When modeling input symbols, the granularity of modeling your application matters and it is advised that you **think in use cases**. 
Here is the reason why:

For example, if you create an input symbol for each possible click on each link or button, you will have a very detailed and big model of your application's behavior.
However, the verification of specifications will not be that easy.
Additionally, learning will usually take much longer as the number of symbols grows.

In contrast to that, you should not treat a symbol as a whole integration test. 
For example you could create a symbol _TestAuthenticationSystem_ that creates a user, logs him in and then out. 
This has several disadvantages. 
You do not test at any other point of your application if a logout is possible without explicitly modeling it twice. 
Furthermore, the learned model will most likely not represent your _real system_ very accurately.  

Instead, we think it is good if you create something in between those extremes. 
As already mentioned, try modelling **use cases** of your application. 
As an example, have a look at Wordpress. 
Possible symbols could be:

- Login
- Logout
- Create a post
- Publish a post
- Mark a comment as spam
- ...

Each point can be modeled as an input symbol and the learned model will tell you clearly what is possible and what is not while still be able to easily find possible errors in an application.


## Modeling authentication systems

### Basic HTTP Auth

![Auth](assets/auth-1.jpg)

The *Make request* action and the *Open URL* action both support the specification of credentials, consisting of a login and a password, in order to use basic HTTP auth.

### JSON Web Tokens (JWT)

![Auth](assets/auth-2.jpg)

JWTs are usually used to authenticate against REST APIs by sending an encoded token in the *Authorization* header, like `Authorization: Bearer <TOKEN>`. 
In ALEX, you can specify HTTP headers in the *Make request* action.
It usually makes sense to store the JWT in a variable and let ALEX insert it dynamically, like in the image above.

### Cookie-based authentication

In the *Make request* and in the *Open URL* action you can specify both, cookies and additional HTTP header fields, if necessary.

A common method to use cookies is to authenticate via the web interface and use the cookie for REST requests.
In order to model this, first model the login behavior via the web interface.
Then, use the *Set variable by cookie* action with the *Browser cookie* option to save the cookie.
After that, the cookie is stored in a available and can be used in the *Make request* action.


## Resetting an application

While learning, sequences of symbols are created and executed on your application. 
We assume that your application behaves input deterministically, i.e. each sequence that is executed will always yield the same output. 
As a consequence, for each sequence, the system has to be put in a state where all further executions are independent from the ones before.
Practically, this can be done by *resetting* the system.
In ALEX, the reset mechanism is modeled as a symbol that by convention we call *Reset*.
What a reset looks like is up to you and depends on the application, but here are some examples:

* If you have a **static web site** that only consists of a few linked HTML files and you want to make sure they are linked correctly, the reset symbol could consist of an action to go to the index page.

* If you have a **user management system** and want to test user specific features only, your reset symbol could simply consist of the creation of a new user. 
  For example if you want to test a users ability to create, update and delete a business entity, then, a reset could create a new user and log him in. 
  If he now creates a entity, his action does not interfere with actions executed by other users.

* Sometimes it may be necessary to **clear the database** in order to remove all entities. 
  Since we have no actions that connects to a database to execute queries you will have to work around that, e.g. by 

    1. creating a temporary REST endpoint that is called that resets the database, or by 
    2. adding a button to the frontend that is hidden in the admin panel that does the same.

As you can see, how you model a system reset is not always trivial and is highly dependant on how the target application works and what exactly you want to test.


## Learning process configuration

Before you start a learning process, you can configure some parameters like the algorithm or the equivalence oracle. 
ALEX runs all tests with reasonable preconfigured settings.
Here are some advices:

- The *TTT* algorithm usually performs best.
- The default settings for the Random Word equivalence oracle is ok for models that you do not expect to get bigger than 4 to 6 states. 
  There is no real rule of thumb here, but if you expect your models to be bigger that that, adjust the parameters correspondingly.
- The complete and W-method equivalence oracle can be used when you can run your tests over night or the weekend, or for a really small alphabet size. 
- Enabling the membership query cache is preferred.
- Provide multiple URLs during the project creation so that equivalence oracles and some algorithms can perform better.


## Learning JavaScript enabled applications

- When modeling symbols for JavaScript heavy websites, e.g. single page applications, make use of the *wait for ...* actions. 
  This way, Selenium can handle dynamic changes of the DOM better.


## Further remarks

![Learning Error](assets/learning-error.jpg)

- Sometimes, you might get a cryptic error message while learning (like in the image above) that says something like: *expected symbol ok ok failed(1) but got symbol ok failed(2) ok*.
  This means that the same query resulted in two different system outputs, which indicates that the system does not behave deterministically.
  More often, the real reason is one of the following:
  
  1. The reset does not really reset the application.
  2. Faulty symbol modeling, triggered by a counter that has not been incremented or something like that.
  3. Selenium behaves off which mostly happens in single page applications.
     Refactor the modeling of the symbol that leads to the error, e.g. increase timeouts.
  4. Your system is fully occupied, thus the web browser needs longer to react than the timeouts that are specified.
  5. The driver executable fails to connect to the web browser, which can happen at times.
     The only solution here is to continue learning from the last known hypothesis.
