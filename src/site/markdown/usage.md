Usage of ALEX
===============


Frontend
--------

In order to make sure that the front-end functions as intended, it is recommended you use a modern web browser that
implements most of the HTML5 and CSS3 specifications. The application should run just fine for the following browsers:

 - Chrome >= 42.0.*
 - Firefox >= 36.0
 
It is not guarantied that it also works with lower versions. If you keep your browser up to date you should not encounter
any major issues. If you find bugs of any kind relating to the specified versions or find that certain parts of the
following manual lack of useful information, let us know.

### <a name="project-management"></a> Project Management

Projects are the entities that are used to manage multiple applications separately in ALEX. You can for example create
a project for your application in version x and another one for version x+1 while having a different set of symbols and
saved learning results.

#### <a name="project-management-create"></a> Creating Projects

From the front page either go to */project/create* or use the menu entry in the main navigation.

![Create Project](images/project-create.jpg)

On the following page a new project can be created. Therefore, a form with the following entries is displayed.

| Field       | Description                                                                            | Required |
|-------------|----------------------------------------------------------------------------------------|----------|
| Name        | A unique name for your project                                                         | yes      |
| URL         | The root URL your application is accessible under. Has to start with *http* or *https* | yes      |
| Description | A description of your project                                                          | no       |

If the creation has been successful you should be redirected to the front page where the newly created project is listed.
A click on it opens the project and leads to a work in progress dashboard which is the entry point for every other
interaction with your project.

![Project Dashboard](images/project-dashboard.jpg)

In order to switch to another project you have to close the current one at first. The button for this action can be
found in the menu that is shown in the picture above. It redirects to the front-page. For working on multiple projects
simultaneously, you can open another tab and call ALEX from that one again.

#### <a name="project-management-editing-deleting"></a> Editing & Deleting Projects

Deleting and updating projects can be done under */project/settings* which can also be accessed by navigating through
the menu entries as shown in the previous section. Before deleting a project, make sure you have exported your symbols,
hypotheses and/or statistics because with the deleting of a project, all these values are deleted from the server, too.

### <a name="symbol-management"></a> Symbol Management

Symbols are a core element of Active Automata Learning. A List of URLs that can be accessed with ALEX and their
functionality is listed in the following table. For each aspect the following subsections provide a more detailed look.

![Symbols Menu](images/symbols-menu.jpg)

| URL                           | Description                                       |
|-------------------------------|---------------------------------------------------|
| /symbols                      | Create, update & delete symbol groups and symbols |
| /symbols/\<symbolId\>/actions | Manage actions of a specific symbol               |
| /symbols/\<symbolId\>/history | Restore old revisions of a specific symbol        |
| /symbols/trash                | Restore deleted symbols                           |
| /symbols/import               | Import symbols from a \*.json file                |
| /symbols/export               | Export symbols into a \*.json file                |

#### <a name="symbol-groups"></a> Symbol Groups

With symbol groups you can organize symbols of a project. For example you can create a group that contains symbols that
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

#### <a name="symbols"></a> Symbols

Symbols are the heart of Active Automata Learning.

Note that once you *delete* a symbol it is not permanently removed from the server, but hidden. As a consequence, they
can be made visible by going to */symbols/trash* or by clicking the corresponding menu entry in the main menu. There, a
list of all hidden symbols is given. Recovering a symbol makes it appear again in the group it previously was in. In 
case the group has been deleted, the symbol is moved to the default group.

#### <a name="actions"></a> Actions

The function of a symbol is defined by its actions and their execution order. An action can be understood as a real
interaction with a system, like clicking on buttons, submitting forms, making requests to an API and so on. 

In order to manage actions of a single symbol, go to */symbols/\<symbolId\>/actions* or click on the link below a symbol
under */symbols*. Here, actions can be created, edited, deleted and ordered. The list that is shown represents the order
of execution on the application as soon as the symbol is called by the learner. Make sure to save changes that have been 
made in the current session, since CRUD operations and re-ordering of actions is not saved automatically. This is simply 
possible by clicking the *save* button on the right in the sub-menu.

*image-action-editor*

The creation of actions is realized in a modal window that shows the action editor as shown in the picture above. As one
can see, the left column contains dropdown boxes with a logical grouping of actions. The right column reveals a form
with required input fields for a selected action. The action groups are presented in to following.

##### <a name="actions-web"></a> Web Actions

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

More detailed information about all the parameters of each web action is omitted as this point, since the forms should
be labeled sufficiently.

If you play around a little with the action editor, you may realize that most web actions require you to enter a CSS path
to an affected element. This may be not that easy to find out in case you are not very familiar with HTML. So, there is
a button that is labeled with *"Element Picker"*. This is a special feature of ALEX for selecting HTML elements from your 
website directly without having to know HTML.

###### <a name="actions-web-html-element-picker"></a> HTML Element Picker
or import
The HTML element picker has been tested but it can not be ensured that picking the right element works in all possible
use cases. If the HTML picker should fail you can still get the CSS path of an element with the developer tools of your
browser.

In Google Chrome, make a right click on the desired element and choose the entry *Inspect Element*. The developer tools
sidebar should open and reveal the element in the DOM tree. There, make another right click on the element and choose
*Copy CSS Path* which copies the unique CSS selector in the clipboard of your operating system. A similar approach can
be applied with Firefox.

##### <a name="actions-rest"></a> REST Actions

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

##### <a name="general-actions"></a> General Actions

| Name                       | Description                                                         |
|----------------------------|---------------------------------------------------------------------|
| IncrementCounter           | Increment a counter.                                                |
| Execute Symbol             | Include and execute another symbol.                                 |
| SetCounter                 | Set a counter to a new value.                                       |
| SetVariable                | Set a variable to a new value.                                      |
| SetVariableByHTMLElement   | Set a variable to a value form a website element.                   |
| SetVariableByJSONAttribute | Set a variable to a value form a JSON response.                     |
| Wait                       | Wait for a specific amount of time. This can be useful for background tasks or AJAX calls, but should be used with care because it can slow the learning process down. |

| Notation          | Description                                                           |
|-------------------|-----------------------------------------------------------------------|
| {{#counterName}}  | The value of the counter with the name *counterName* is inserted      |
| {{$variableName}} | The value of the variable with the name *variableName* is inserted    |


#### <a name="symbols-import-revision"></a> Revision Management

Changing a symbol in any way results in the creation of a new revision of it. A previous state of a symbol can be 
recovered.

#### <a name="symbols-import-export"></a> Export & Import

If you want to save a set of symbols for another project or use already existing ones, the export and import function
might be of interest for you.

### <a name="learning-experiment-modeling"></a> Learning Experiment Modeling

#### <a name="learning-experiment-modeling-hypothesis-interaction"></a> Hypothesis Interaction

#### <a name="learning-experiment-modeling-internal-data-structures"></a> Internal Data Structures
 
#### <a name="learning-experiment-modeling-counterexamples"></a> Counter Example Testing

### <a name="learning-experiment-analysis"></a> Learning Experiment Analysis

#### <a name="learning-experiment-analysis-hypothesis-comparison"></a> Hypotheses Comparison

#### <a name="learning-experiment-analysis-statistics"></a> Statistics


Try the REST API
----------------

