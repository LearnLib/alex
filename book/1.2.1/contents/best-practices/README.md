# Best practices

In this section, some of the best practices for using ALEX are written down. These rely on our own experiences while modelling and learning several web applications and REST interfaces.


## Symbol modelling

When modelling symbols, the granularity of modelling your application matters and it is advised that you **think in use cases**. Here is the reason why:

For example, if you create a new symbol for each possible click on each link or button, you might have a very detailed and concrete model of your application, but it will not be visually observable. Additionally, learning will usually take much longer as the number of symbols grows.

On the contrary, you should not treat a symbol as a whole integration test. For example you could create a symbol _TestAuthenticationSystem_ that creates a user, logs him in and then out. This has several disadvantages. You do not test at any other point of your application if a logout is possible without explicitly modelling it twice. Furthermore, the learned model will most likely not represent your _real system_ very accurately.  

Instead, we think it is good if you create something in between those extremes. As already mentioned, try modelling **use cases** of your application. As an example, have a look at Wordpress. Possible symbols could be:

- Login
- Logout
- Create a post
- Publish a post
- Mark a comment as spam
- ...

Each point can be modelled as a symbol and the learned model will tell you clearly what is possible and what is not while still be able to easily find possible errors in an application.


## Modelling authentication systems

### Basic HTTP Authentication

The *Call* action and the *Open URL* action both support the specification of credentials, consisting of a login and a password, in order to use basic HTTP auth.

### JSON Web Tokens

JWTs are usually used to authenticate against REST APIs by sending an encoded token in the Authorization header like *Authorization: Bearer TOKEN*. 
In ALEX, you can specify HTTP headers in the *Call* action.


## Resetting an application

While learning, sequences of symbols are created and executed on your application. We assume that your application behaves deterministically, i.e. for each sequence that is executed it has to be made sure that the very same sequence will always, at any time in the system yield the same result. As a consequence, for each sequence, the system has to be put in a state where all further executions are independent from the ones before. For this reason it is required that you model a system reset with a separate symbol.

What a reset looks like is up to you and depends on your application, but here are some examples that might be relevant for your application:

If you have a static web site that only consists of a few linked html files and you want to make sure they are linked correctly, the reset symbol could consist of an action to go to the front page.

If you have a user management system (like in the Wordpress example from above) and want to test user specific features only, your reset symbol could simply consist of the creation of a new user _if the users actions are independant from each other_. If we stick with the Wordpress example, this could be an example: You want to test a users ability to create, update and delete a post he created. Then, a reset could create a new user and log him in. If he now creates a new post, his action does not interfere with actions executed by previous users.

Then, sometimes, you want to test exactly how the actions of one user impact the actions of another one or how they work together. The tasks of creating and publishing a post could be executed by users of different roles. For this case, we came up with the ability to store variables and counters that should help you with modelling these kinds of situations.

Sometimes it may be necessary to reset a complete database in order to remove all working objects. Since we have no actions that connect to your database to execute queries (would be a cool feature though...) you will have to work around that, e.g. by creating a temporary REST API endpoint that is called for that or by pressing some button that is hidden in the admin panel, etc.

As you can see, how you model a system reset is not always a trivial problem and is highly dependant on how your application works and what exactly you want to test, so we can not give you a recipe for all possible use cases.


## Learn process configuration

Before you start a learn process, you can configure some parameters like the algorithm used or the equivalence oracle. ALEX runs all tests with reasonable preconfigured settings.

- If the duration of the test is crucial to you, **do not use any other algorithm than the TTT**, it is the fastest algorithm out there right now.
- The default settings for the Random Word oracle is ok for models that you expect not to get bigger than 4 to 6 states. There is no real rule of thumb here, but if you expect hypotheses bigger that that, adjust the parameters correspondingly.
- The complete oracle can be used when you can run your tests over night or the weekend, or for a really small alphabet size. Same as with the W-Method oracle, since it works similarly.
- Enabling the membership query cache is preferred.


## Learning JavaScript enabled applications

- For the execution of the experiments, don't choose a headless web browser like the HTML Unit Driver. Instead, configure ALEX to use either Chrome or Firefox.
- When modelling symbols for JavaScript heavy websites, e.g. single page applications, make use of the *wait for node* action when interacting with elements of the website. This way, Selenium can handle dynamic changes of the DOM better.


## Further tips

- Try to avoid cyclic symbol calls, e.g. do not create a symbol A that calls symbol B that calls symbol A. The algorithm does not prevent cyclic symbol calls and will run forever.
- Sometimes, you might get an error message while learning that says something like: *expected symbol ok ok failed(1) but got symbol ok failed(2) ok*. This error can, in most cases, be reduced to a non deterministic system or a faulty modelling, triggered by a counter that has not been incremented or something like that.
- If possible, make use of the possibility to define multiple URLs where the target application can be accessed under. This way, membership queries can be executed in parallel which saves a lot of time, especially equivalence queries. 