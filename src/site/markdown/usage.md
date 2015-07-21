Usage of ALEX
=============

Here you can find a detailed explanation of the concepts and ways to use ALEX, regarding the RESTful API that powers
the application as well as the graphical client for it. This document covers the necessary parts to understand and
use both parts.

For a deeper insight in the concepts and theory behind the application, consider reading the bachelor theses 
<a href="documents/ba-thesis-bainczyk.pdf" target="_blank">A Simplicity-Oriented Web-Based Approach to Active Automata
 Learning</a> that covers the front-end parts and <br/><a href="documents/ba-thesis-schieweck.pdf" target="_blank">A 
 Service-Oriented Interface for Testing Web Applications via Automata Learning</a> that deals with the REST API and the
 connection to the <a href="http://learnlib.de/" target="_blank">LearnLib</a>.
 
If you find bugs of any kind relating this application or inaccuracies in this manual, 
[let us][mails] know.

[mails]: mailto:alexander.bainczyk@tu-dortmund.de,alexander.schieweck@tu-dortmund.de


Description and Features
------------------------

ALEX offers a simplicity-oriented way to model and execute tests on web applications and web services that are based 
on active automata learning. Based on the function set of the <a href="http://learnlib.de/" title="LearnLib">LearnLib</a> 
and inspired by the <a href="http://ls5-www.cs.tu-dortmund.de/projects/learnlib/download.php">LearnLib Studio</a> the 
application lays a focus on the ease to use of the tool while offering an extensive feature set:

* Active Automata Learing of web applications and web services
* Support for managing and learning multiple applications
* Graphical symbol construction
* Graphical learning process modelling
* Automatic generation and visualization of
    * Hypotheses
    * Internal da structures (Observation Table and Discrimination Tree)
    * Statistics regarding learning results
* Simultaneous learning of web applications and web services
* Supported algorithms: L\*, TTT, Discrimination Tree, DHC
* Supported equivalence oracles: Random Word, Complete, Sample
* Import and Export of symbol sets
* Export of Hypotheses as JSON and SVG
* Export of internal data structures


Requirements
------------

In order to run both, the RESTful API and the browser-based client of ALEX, your computer needs to fulfill certain 
specifications which are

* Windows 8.1 or higher / Linux as operating system
* Java 8 Runtime Environment
* Chrome >= 42.0.\* / Firefox >= 36.0

It may be that the application also runs on lower versions of Windows and MacOS, as well as on other web browsers like
Opera and Safari, but ALEX has been and is developed on machines with the mentioned specifications.
 
Working Objects
---------------

Project
:   A project is the main object that the following objects belong to. It is bound to a unique name and a URL that 
    starts with *"http\[s\]://"*. This property defines the root URL of an application to be learned. In ALEX it is
    allowed to create and manage multiple projects, thus, for example, allowing to treat a web application and a web
    service as different projects or managing multiple complete different applications.

Symbol Group
:   A project is the main object that the following objects belong to. It is bound to a unique name and a URL that 
    starts with *"http\[s\]://"*. This property defines the root URL of an application to be learned. In ALEX it is
    allowed to create and manage multiple projects, thus, for example, allowing to treat a web application and a web
    service as different projects or managing multiple complete different applications.
    
Symbol
:   Symbols are used by the learner to learn an application. They are defined by a unique name and an abbreviation. 
    The latter is shown as an edge label of the learned model of an application to make it visually clear. Each symbol
    consists of an ordered list of actions that define the actual logic of the symbol once it is executed.
    
Action
:   Actions are atomic operations on an application. In ALEX, there are three types. **Web** actions are
    inspired by Selenium and directly interact with the web interface of an application that for example is clicking a 
    button, filling out input fields and submitting forms. **REST** actions allow to define actions with
    a REST API and **General** actions allow interoperability between actions and symbols.
    
Learning Configuration
:   For each learning process, a learning configuration has to be created. It consists of an alphabet, which is a set
    of created symbols, a reset symbol (a symbol that is used to reset an application before each MQ), a learning
    algorithm and an equivalence oracle. Of cause the length the alphabet has to contain at least one symbol and reset
    symbol is required as well.
    
Learning Resume Configuration
:     A learning resume configuration is needed when the learner finished learning and the user wants to continue the
      process. Therefore, it only consists of an equivalence oracle.
      
Learning Result
:   As soon as a learning process has finished, a learning result is generated for each step the learner took to generate
    the final hypothesis. For each step, it contains the actual learning configuration, statistics and the hypothesis as
    a JSON representation.

Workflow
---------

When working with ALEX, the workflow for learning a web application starting with the creation of a project and resulting
in the generation of a model of this application follows a common pattern. The next chapters deal with an in-depth view
on the points listed below:

1. Create a project with the root URL the learned application is accessible under
2. Optionally create several symbol groups
3. Create a set of symbols, including one that handles the reset logic
4. Create actions for each symbol
5. Model a learning process and start learning
6. Display the hypothesis, internal data structures, analyze the statistics


Frontend
--------

Starting from the entry URL of ALEX, the graphical client can be accessed under http:/localhost:\<port\>/app. From there
on the following URLs lead to different parts of the application.

| URL                                 | Description                                               |
|-------------------------------------|-----------------------------------------------------------|
| /home                               | Displays a list of created projects if none is opened     |
| /project                            | Shows the dashboard of an opened project                  |
| /project/create                     | Create a new project                                      |
| /project/settings                   | Edit and delete an opened project                         |
| /counters                           | Lists and manages the counters of a project               |
| /files                              | Lists and manages uploaded files to a project             |
| /symbols                            | Create, update & delete symbol groups and symbols         |
| /symbols/\<symbolId\>/actions       | Manage actions of a specific symbol                       |
| /symbols/\<symbolId\>/history       | Restore old revisions of a specific symbol                |
| /symbols/trash                      | Restore deleted symbols                                   |
| /symbols/import                     | Import symbols from a \*.json file                        |
| /symbols/export                     | Export symbols into a \*.json file                        |
| /learn/setup                        | Setup and start a learning experiment                     |
| /learn/start                        | Shows the loadscreen and intermediate learning results    |
| /learn/results                      | Lists all finished final learning results of a project    |
| /learn/results/statistics           | Generate statistics from learning results                 |
| /learn/results/compare/\<testNos\>  | Side-by-side comparison of multiple learning results      |
| /about                              | An information page about the application                 |
| /help                               | A page offering help to the usage of ALEX                 |
| /error                              | Shows fatal error messages                                |

Except for the about, help, error, home and the create project page, all other routes require that a project has been
created and is opened.


### Navigation

All pages of the front-end are accessible through the navigation that is placed on top of the screen. Depending if an
instance of a project is saved in the session storage, the navigation can be in either one of the following two states.
The first one (first image) shows the navigation bar if no project is opened by a user. Only the index page, the page
to create a new project and the about and help page are accessible. In case a project has been opened (second image) all
pages that deal with working objects that relate to the opened project are accessible.

![Navigation bar](images/navigation-1.jpg)

![Navigation bar](images/navigation-2.jpg)


### Project Management

Projects are the entities that are used to manage multiple applications separately in ALEX. You can for example create
a project for your application in version x and another one for version x+1 while having a different set of symbols and
saved learning results.

Most of the URLs listed in the previous section require a project to be *opened*, which means has been selected from the
applications start page. It is then saved in the session storage of the web browser. In case a project is persisted no 
other project can be opened in the same tab. The use of multiple tabs allow to open and work with multiple projects at a 
time. In order to switch to another project of the same tab, it has to be *closed*. That means it has to be removed from 
the session storage, either by clicking the menu item from the main navigation or by closing the current tab.


#### Create, Edit and Delete Projects

| Field       | Description                                                                            | Required |
|-------------|----------------------------------------------------------------------------------------|----------|
| Name        | A unique name for your project                                                         | yes      |
| URL         | The root URL your application is accessible under                                      | yes      |
| Description | A description of your project                                                          | no       |

The URL of a new project has to start with *http://* or *https://* followed by at least one further character for the 
host. Technically, any host can be entered and therefore any web site can be learned. Due to the traffic that is caused 
by the learning process, it is recommended to only learn web applications you are the owner of, be it a local or a 
remote host.

If the creation has been successful a user should be redirected to the front page where the newly created project is 
now listed. A click on it opens the project and leads to a work in progress dashboard which is the entry point for every 
other interaction with your project.

In order to switch to another project you have to close the current one at first. The button for this action can be
found in the menu under the navigation point with the name of the opened project. It redirects to the front-page. For 
working on multiple projects simultaneously, you can open another tab and call ALEX from that one again.

Deleting and updating projects can be done under the premise that there is no active learning process with the project,
Before deleting a project, make sure you have exported your symbols, hypotheses and/or statistics because with the 
deleting of a project, all these values are deleted from the server, too.


### Symbol Management


#### Symbol Groups

With symbol groups symbols of a project can be organized. For example you can create a group that contains symbols that
are used to reset an application, another one for web related symbols and a further one for symbols relating to your 
REST API, but it's completely up to you. **Do not mistake a symbol group for an alphabet!** A symbol group is just a 
container for symbols and should help you organize them.

Symbol groups can be created, edited and deleted under the URL */symbols*. In order to create a new one, hover over the
*create* button in the sub-navigation and click on the corresponding entry. In the modal window choose a unique name
for a symbol group. In order to change the name of a group or to delete it, click on the gear-button beside the symbol
group name and do these actions in the modal window.

ALEX offers a default group where new symbols are moved to if no other group is specified. It can not be deleted, but 
renamed. Furthermore, deleting a symbol group induces all symbol to get deleted as well (more in the next chapter).

For a better overview over a large set of symbols, symbol groups can be collapsed by clicking on the arrow button on 
the left of each entry.


#### Symbols

Symbols can be created, updated, deleted and moved into into other symbol groups. The creation of a symbol requires
several properties.

| Name          | Description                                                                                       |
|---------------|---------------------------------------------------------------------------------------------------|
| name          | A unique name of the symbol                                                                       |
| abbreviation  | A unique abbreviation with 15 characters at max. They are displayed in the hypotheses and should be named meaningfully |
| symbol group  | Optionally the symbol group the symbol should be created in can be passed. If this property is not given, the symbol is moved to the default group |

Note that once you *delete* a symbol it is not permanently removed from the server, but hidden. As a consequence, they
can be made visible by going to */symbols/trash* or by clicking the corresponding menu entry in the main menu. There, a
list of all hidden symbols is given. Recovering a symbol makes it appear again in the group it previously was in. In 
case the group has been deleted, the symbol is moved to the default group.


#### Actions

The function of a symbol is defined by its actions and their execution order. An action can be understood as a real
interaction with a system, like clicking on buttons, submitting forms, making requests to an API and so on. 

In order to manage actions of a single symbol, go to */symbols/\<symbolId\>/actions* or click on the link below a symbol
under */symbols*. Here, actions can be created, edited, deleted and ordered. The list that is shown represents the order
of execution on the application as soon as the symbol is called by the learner. Make sure to save changes that have been 
made in the current session, since CRUD operations and re-ordering of actions is not saved automatically. This is simply 
possible by clicking the *save* button on the right in the sub-menu.

The creation of actions is realized in a modal window that shows the action editor as shown in the picture above. As one
can see, the left column contains dropdown boxes with a logical grouping of actions. The right column reveals a form
with required input fields for a selected action. The action groups are presented in to following.

Each action can be marked with three different flags which are

| Flag          | Description                                                                                           |
|---------------|-------------------------------------------------------------------------------------------------------|
| negated       | Negates the outcome of an action.                                                                     |
| ignoreFailure | If this flag is set to "true" proceedings actions are executed although the action failed             |
| disabled      | If this flag is set to "true" its execution is skipped during the call of its symbol                  |


##### Web Actions

Web actions are used to interact with a browser interface as a real person would do. They are based on Selenium actions
and ALEX offers a subset of these that are presented in the table below.

| Name               | Description                                           |
|--------------------|-------------------------------------------------------|
| CheckNode          | Check if a certain element is present on the website. |
| CheckText          | Check if a certain text is part of the website body.  |
| Clear              | Clear an input field.                                 |
| Click              | Click on an element.                                  |
| Click Link By Text | Click on a link with a specific text value            |
| Fill               | Clear and fill an input field with some text.         |
| Goto               | Request a specific site.                              |
| Submit             | Submit a form.                                        |
| Select             | Select an option form an select input field.          |

More detailed information about all the parameters of each web action is omitted as this point, since the forms in the
front-end should be labeled sufficiently.

If you play around a little with the action editor, you may realize that most web actions require you to enter a CSS path
to an affected element. This may be not that easy to find out in case you are not very familiar with HTML. So, there is
a button that is labeled with *"Element Picker"*. This is a special feature of ALEX for selecting HTML elements from your 
website directly without having to know HTML.


###### HTML Element Picker

The HTML element picker has been tested but it can not be ensured that picking the right element works in all possible
use cases. If the HTML picker should fail you can still get the CSS path of an element with the developer tools of your
browser.

In Google Chrome, make a right click on the desired element and choose the entry *Inspect Element*. The developer tools
sidebar should open and reveal the element in the DOM tree. There, make another right click on the element and choose
*Copy CSS Path* which copies the unique CSS selector in the clipboard of your operating system. A similar approach can
be applied with Firefox.

1. Load a URL by entering a path relative to the base URL of the project in the URL bar on the top left.
2. Click on the button with the wand symbol. All elements should now get a thick red border as soon as you hover over it.
3. Click on the element you need the CSS path from. The selection mode should be disabled.
4. Click on the button with the label "ok" on the top right. The CSS path should automatically be entered in the correct
input element.

In the case that clicking on an element does not work as indented, probably because of some JavaScript, pressing the "Ctrl"
button on the keyboard has the same effect as a click, but does not fire a click event.

For some actions, like "CheckText", the HTML element picker can be used as well. With the same method, it automatically
extracts the textContent value of an element and pastes the content to the corresponding input field. This also works
with the "Fill" action. Enter a value in the desired input field, select the element with the HTML element picker and it
extracts both, the value and the CSS path of it.


##### REST Actions

REST actions are the counterpart to web actions. They are used to communicate with RESTful interfaces. The table below
shows a list of available actions.

| Name                 | Description                                                     |
|----------------------|-----------------------------------------------------------------|
| Call                 | Do a REST Call.                                                 |
| CheckAttributeExists | Check if the response has an specific attribute.                |
| CheckAttributeType   | Check if an attribute in the response has a specific type.      |
| CheckAttributeValue  | Check if an attribute in the response has a specific value.     |
| CheckHeaderField     | Check if the response has a certain header field.               |
| CheckStatus          | Check if a previous response returned the expected HTTP status. |
| CheckText            | Check the response body.                                        |

Keep in mind that working with HTTP requests and responses follows a certain pattern. Normally, you make a request and
analyze the results. The order of your REST actions should also look like that. Start with a *Call* action and use other
actions to work with the response.


##### General Actions

Actions of this group allow the interaction between different symbols and actions, for example by storing and passing
String and Integer values to other actions.

| Name                       | Description                                                         |
|----------------------------|---------------------------------------------------------------------|
| IncrementCounter           | Increment a counter.                                                |
| Execute Symbol             | Include and execute another symbol.                                 |
| SetCounter                 | Set a counter to a new value.                                       |
| SetVariable                | Set a variable to a new value.                                      |
| SetVariableByHTMLElement   | Set a variable to a value form a website element.                   |
| SetVariableByJSONAttribute | Set a variable to a value form a JSON response.                     |
| Wait                       | Wait for a specific amount of time.                                 |

*The wait action can be useful for background tasks or AJAX calls, but should be used with care because it can slow 
down the learning process.*


##### Working with Counters, Variables

Many web applications handle dynamic data and allow file uploads. In order to model and learn such behaviours and to 
allow interaction between different symbols, actions and learning processes, *counters*, *variables* and *files* are 
introduced.

Counter
:   As the name indicates counters are integer values that are persisted in the database per project. They
    can be incremented and set at will. Commonly they are used to create multiple objects of the same kind. Counters 
    can help to model a system reset and thereby allow a consecutive execution of multiple learning processes without 
    having to manually reset the application in between every test.   
    
Variables
:   Variables can only contain String values and are kept alive during a membership query.

In order to make use of those in actions, there is a notation that has to be used in action fields, as presented in the
following table.

| Notation          | Description                                                           |
|-------------------|-----------------------------------------------------------------------|
| {{#counterName}}  | The value of the counter with the name *counterName* is inserted      |
| {{$variableName}} | The value of the variable with the name *variableName* is inserted    |

As an example for the use of counters and variables, let there be a variable *userName* with the value \'*Admin*\' and
a counter *countLogins* with the value \'*5*\'. The following symbol makes use of both.

```json
[{
    "name" : "symbol1",
    "abbreviation" : "s1",
    "actions" : [{
        "type" : "web_checkForText",
        "value" : "Hello {{$userName}}! You logged in for the {{#countLogins}}th time.",
        "regexp" : false
    }]
}, ... ]
```
    
As soon as the action is executed the value of the property \'value\' is parsed, the values for the variable *userName*
and the counter *countLogins* are inserted into the String. The resulting text that is searched for would be \"*Hello
Admin! You logged in for the 5th time today.*\".

<!--
*For modeling file uploads use the \'fill\' action, select the proper input element and insert \{\{\filename.ext\}\} in 
the value field. In order for this to work, the file has had to be uploaded first.*
-->


#### Revision Management

Changing a symbol in any way results in the creation of a new revision of it. A previous state of a symbol can be 
recovered.

__Info:__ If you revert a symbol with revision *x* to a previous revision *x-i*, a new symbol with the revision *x+1* is
created. If you have any actions that execute other symbols, you have to manually adjust those, so that they call the 
most current symbol (In case this is wanted).


#### Export & Import

If you want to save a set of symbols for another project or use already existing ones, the export and import function
might be of interest for you. Note that when exporting symbols, their revision, id and group are deleted in order to be 
compatible with other projects.

ALEX supports the import from and export in a JSON file. Technically, the possibility of creating symbols with a simple 
text editor by hand and uploading them to the system is given. Therefore, the file has to look as follows:

```json
[{
    "name" : "symbol1",
    "abbreviation" : "s1",
    "actions" : [ ... ]
}, ... ]
```
    

### Learning Experiment Modeling

In order to start learning an application, a learning process has to be modeled. Such a process always consists of the
following components:

* An input alphabet (set of symbols)
* A symbol to reset the application
* An algorithm
* A parametrized equivalence oracle
* A maximum amount of steps to learn

Algorithm
:   There are currently four algorithms supported: L*, Discrimination Tree, DHC and TTT.

Equivalence oracle
:    ALEX supports three kinds of oracles. The first one is *Random Word*, the second one is *Complete* and the last one is 
    *Sample*. The first two oracles approximate equivalence queries automatically to find counterexamples while when using 
    *Sample*, you are asked to search and enter them by yourself in between iterations.   
    
Steps to learn
:   You can also define how many hypotheses should be generated at maximum. When the learner stops, you can still continue
    learning from this point.
    
Comment
:   Furthermore a comment can be added that makes it easier to identify a specific learning result between others. The
    comment is a string value with a maximum amount of 120 characters.

The mentioned equivalence oracles have different strategies on how to find counterexamples. Each one can be configured with
different parameters that define their behaviour.

Random Word
:       The Random Word oracle approximates equivalence queries by generating random words from learned symbol set and 
        executes them on the learned applications. The oracles expects three parameters: <em>minLength</em> defines the
        minimum length of a generated word, <em>maxLength</em> the maximum length and <em>numberOfWords</em> the amount
        of randomly generated words to test.
        
Complete
:       This oracle generates all possible word within some limits. <em>minDepth</em> describes the minimum length of 
        a generated word, <em>maxDepth</em> the maximum length.
        
Sample
:   If this oracle is chosen, counterexamples are searched by hand by the user.

In order to simplify the modeling phase, only the learning alphabet and the reset symbol has to be chosen. As default, the
L\* algorithm is selected in combination with the random word oracle. A click on the button with the label "start" starts
the learning process with the given configuration. The user gets redirected to a loading screen where the generated
hypothesis is displayed as soon as the server generated one.

While ALEX is learning there are some restrictions concerning the functionality. You can not delete the current project as
the instance is required by the learner. Due to the architecture of ALEX, there can always only be one learning process at
a time.


### Hypothesis Interaction

The possibility to interact with generated models can be separated into two phases. The first one is while a learning
process is running and the second one is after having finished learning an applications. The latter is dealt with in the
section [Learning Experiment Analysis <b class="caret"></b>](#Learning_Experiment_Analysis "Learning Experiment Analysis").


#### Internal Data Structures

ALEX provides the visualisation of the *Observation Table* that is used by the *L\** algorithm and the *Discrimination
Tree* from the equally named algorithm. Both are saved for each iteration the learner executes and can be displayed in
the same panel corresponding hypothesis is presented in. While observation tables can be exported as a CSV file, 
discrimination trees can be downloaded in the SVG format.
 
 
#### Testing Counterexamples

In between two iterations of a learning process it is possible to search and test counterexamples directly on the 
displayed hypothesis and then start the next iteration with respect to entered counterexamples. This process follows
this patter:

1. Choose the equivalence oracle *Sample* from the widget in the sidebar
2. Create a word by clicking on the labels of the hypothesis
3. In the widget click on the button *\"Test\"*
4. A notification will tell whether the word is a counterexample or not
5. Click on the button *\"Add\"* to add the counterexample the list that is considered for refinement
6. Proceed with step 1 or resume the learning process

Note that while testing a word and it results in being a counterexample, its output labels are automatically switched
to the actual output sequence. The list of symbols can be arranged with drag and drop for quickly testing different 
words. Once a counterexample has been added to the list, it can be edited by clicking on it.

The server assumes that all words given by a user for the refinement actually are counterexamples. If this is not the
case the learning process may fail and the application may have to be restarted by killing the running process.


### Learning Experiment Analysis

After having learned an application, their test results are available for an analysis. This can happen in two ways
that the next sections deals with.


#### Hypotheses Comparison

The first point is the visual comparison of hypotheses in a single tab. The page for that can be equally separated into
multiple columns, where each column can present a hypothesis or an internal data structure. That way it is possible to
have a look at the internal data structure and the hypothesis at the same time. Another possibility is to compare two
or more hypotheses of several test runs. The only restriction is that results can only be compared to other results from
the same project.

![Comparison of hypotheses](images/hypotheses-comparison.jpg)

The image above presents an example of a comparison of the same test run. By clicking on the grey area on the right of 
the display a new column is created. By clicking on the red button in a panel, the column is removed and the size of
the other columns.


#### Statistics

On the statistics page a list of learning results is presented. It is either possible to generate a bar chart of a
selection of final results or an area chart. This one not only includes the cumulated values, but displays all values
of all iterations of each step of multiple learning processes. Statistics can be generated for the following values:

* The number of conducted membership queries
* The number of conducted equivalence queries
* The number of called symbols
* The size of the input alphabet
* The time it took to finish the test or a single step

Each generated chart can be exported as a SVG file. Furthermore, an export of these values in a CSV file for further
research is possible, too. The image below shows an example of a chart of multiple final results (left) and one from
multiple complete results (right). In the second case the visibility of single tests can be toggled by clicking on the
legend entry with the corresponding test number.

![Charts](images/charts.jpg)

Another aspect to mention is that statistics are generated on the fly and are bound to a learning result. In case the
learning result is deleted, the statistics can not be shown any longer.