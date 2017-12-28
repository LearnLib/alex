# User Manual

Here and in the following sections, we present a detailed explanation of the concepts and ways to use ALEX.
If you find bugs of any kind relating this application or inaccuracies in this manual, [let us][mails] know.

[mails]: mailto:alexander.bainczyk@tu-dortmund.de,alexander.schieweck@tu-dortmund.de


## Description and Features

ALEX offers a simplicity-oriented way to model and execute learning experiments for web applications and web services using active automata learning. 
Based on the function set the [LearnLib][learnlib] and inspired by the [LearnLib Studio][learnlibStudio], ALEX lays a focus on the ease to use of the tool while offering an extensive feature set, including:

* Inferring Mealy machines of web applications and web services using active automata learning techniques
* Graphical symbol and learning process modelling
* Automatic generation and visualization of
    * Models
    * Algorithmic data structures (observation table and discrimination tree)
    * Statistics of learning experiments
* Simultaneous learning of web applications and web services
* Various learning algorithms and equivalence approximation strategies
* Integration testing capabilities
* And many more...


## Terminology

This document may contain some terms related to automata learning. 
We now want to explain often used terms that may be helpful for understanding this document.

<dl>
    <dt>System under learning (SUL)</dt>
    <dd>The system we want to infer an automaton model from.
        Often also called system under testing (SUT.)</dd>
    <dt>Symbol</dt>
    <dd>We differentiate between input and output symbols.
        Input symbols are modeled by the user and define possible inputs to a system.
        Output symbols specify how the system reacts to inputs.</dd>
    <dt>Word</dt>
    <dd>A sequence of symbols, e.g. *Authenticate, Create Entity, Read Entity, Delete Entity, Logout*.</dd>
    <dt>Learner</dt>
    <dd>A learner infers an automaton model of an application by posing words to the SUL and analyzing its outputs.</dd>
    <dt>Membership Query (MQ)</dt>
    <dd>The words the learner poses to the system are called membership queries.</dd>
    <dt>Equivalence Query (EQ)</dt>
    <dd>An equivalence query is posed by an equivalence oracle. 
        It checks whether the learned automaton represents the behavior of the tested application correctly.</dd>
    <dt>Hypothesis</dt>
    <dd>A hypothesis is the behavioral automaton model that is learned.
        The model is called hypothesis due to the black box nature of the SUL. 
        Potentionally, there can always exist a behavior that is not captured by the model.</dd>
    <dt>Counterexample</dt>
    <dd>A counterexample is a word, where the output of the system and the learned model differ.
        Counterexamples are used to trigger the refinement of the model.
        We call a model the *final hypothesis*, if no counterexamples can be found.</dd>
</dl>

The following graphic illustrates the general learning process and thus the relation between the terms listed above.

<img src="./assets/aal.jpg" style="display: block; width: 80%; margin: auto">


## Working Objects

<dl>
    <dt>User</dt>
    <dd>A user is identified by its email address and can have one of two roles: <em>ADMIN</em> or <em>REGISTERED</em>.</dd>
    <dt>Project</dt>
    <dd>A project is the main object that the following objects belong to. 
        It is bound to a unique name and a URL that starts with *"http\[s\]://"* that points to the application to test.</dd>
    <dt>Symbol Group</dt>
    <dd>Each project has a list of symbol groups. 
        Symbol groups are logical containers for symbols and allow grouping symbols, e.g. by their purpose or by their feature.
         They are defined by a unique name. 
         For every project, there is a default group with the name <em>"Default Group"</em> which can not be deleted.</dd>
    <dt>Symbol</dt>
    <dd>Symbols are test inputs that are used for learning and testing the target application. 
        Each symbol consists of a sequence of actions that define the actual logic of the symbol once it is executed.</dd>
    <dt>Action</dt>
    <dd>Actions are atomic operations on an application. 
        In ALEX, there are three types: 
        <strong>Web</strong> actions are inspired by Selenium and directly interact with the web interface of an application.
        <strong>REST</strong> actions define interactions with a REST APIs and <strong>General</strong> actions allow interoperability between actions and symbols.</dd>
    <dt>Learner Configuration</dt>
    <dd>For each learning process, a configuration has to be created. 
        It consists of an input alphabet (a set of symbols), a reset symbol (a symbol that is used to reset an application), a learning algorithm, an equivalence approximation strategy and some other parameters.</dd>
    <dt>Learner Result</dt>
    <dd>The result of a learning process includes the automaton model of the application and some statistics.
        Inferring the model usually requires multiple iteration. 
        For each iteration step, the intermediate model and the statistics are saved as well.</dd>
    <dt>Test Case</dt>
    <dd>A test case can be understood as a single integration test. 
        It consists of sequence of symbols that are executed on the system. 
        The execution of a test case either fails or succeeds.</dd>
    <dt>Test Suite</dt>
    <dd>Multiple test cases can be bundles into a test suite, which can also be nested.
        If a test suite is executed, all of its containing test cases and test suites are executed as well. 
        The execution succeeds, if all test cases succeeds, otherwhise it fails.</dd>
</dl>


## Workflow

Roughly speaking, the functionality of ALEX can be separated in two aspects: *testing* and *learning*.
The following diagram illustrates the basic workflow.

<div style="text-align: center">
    <img src="./assets/workflow.png">
</div>

As you can see, the difference between testing and learning is that while tests either pass or fail to execute, a behavioral model is generated while learning.
In this user manual, we will go deeper into the single steps listed in the diagram.


## Frontend

Starting from the entry URL of ALEX, the graphical client can be accessed under http://localhost:&lt;port&rt;. 
From there on, the following URLs lead to different aspects of the application.

| URL                                 | Description                                               |
|-------------------------------------|-----------------------------------------------------------|
| /about                              | An information page about the application                 |
| /admin/settings                     | Application specific settings                             |
| /admin/users                        | User management                                           |
| /counters                           | Lists and manages the counters of a project               |
| /error                              | Shows fatal error messages                                |
| /files                              | Lists and manages uploaded files to a project             |
| /help                               | A page that lists information about ALEX                  |
| /home                               | The home screen to login and create new users             |
| /learner/setup                      | Setup and start a learning experiment                     |
| /learner/learn                      | Shows intermediate learner results                        |
| /projects                           | Shows a list of all projects of a user                    |
| /projects/dashboard                 | Shows the dashboard of the opened project                 |
| /symbols                            | Create, update & delete symbol groups and symbols         |
| /symbols/&lt;symbolId&gt;/actions   | Manage actions of a specific symbol                       |
| /symbols/trash                      | Restore deleted symbols                                   |
| /results                            | Lists all finished final learning results of a project    |
| /results/&lt;testNos&gt;            | Show the hypotheses of the processes with &lt;testNos&gt; |
| /settings                           | Specify web drivers                                       |
| /statistics/&lt;testNos&gt;         | Show statistics for learner results with &lt;testNos&gt;  |
| /tests                              | Management of test suites and test cases                  |
| /tests/&lt;id&gt;                   | Edit the test suite or test case with a given ID          |
| /users/settings                     | Edit the profile of the user that is logged in            |

Except for the *"about"*, *"help"*, *"error"* and the *"home"* page, all URLs require that a user is logged in and a project has been created and is opened.
URLs that are prefixed with */admin* can only be accessed by users that inhibit the *ADMIN* role.

[learnlib]: https://learnlib.de/
[learnlibStudio]: http://ls5-www.cs.tu-dortmund.de/projects/learnlib/download.php
