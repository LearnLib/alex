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

| Field | Description | Required |
|-------|-------------|----------|
| Name | A unique name for your project | yes |
| URL | The root URL your application is accessible under. Has to start with *http* or *https* | yes |
| Description | A description of your project | no |

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

| URL | Description |
|-----|-------------|
| /symbols | Create, update & delete symbol groups and symbols |
| /symbols/\<symbolId\>/actions | Manage actions of a specific symbol |
| /symbols/\<symbolId\>/history | Restore old revisions of a specific symbol |
| /symbols/trash | Restore deleted symbols |
| /symbols/import | Import symbols from a \*.json file |
| /symbols/export | Export symbols into a \*.json file |

#### <a name="symbol-groups"></a> Symbol Groups

#### <a name="symbols"></a> Symbols

#### <a name="actions"></a> Actions

##### <a name="actions-web"></a> Web Actions

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

###### <a name="actions-web-html-element-picker"></a> HTML Element Picker

##### <a name="actions-rest"></a> REST Actions

| Name                 | Description                                                     |
|----------------------|-----------------------------------------------------------------|
| Call                 | Do a REST Call.                                                 |
| CheckAttributeExists | Check if the response has an specific attribute.                |
| CheckAttributeType   | Check if an attribute in the response has a specific type.      |
| CheckAttributeValue  | Check if an attribute in the response has a specific value.     |
| CheckHeaderField     | Check if the response has a certain header field.               |
| CheckStatus          | Check if a previous response returned the expected HTTP status. |
| CheckText            | Check the response body.                                        |

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

#### <a name="symbols-import-export"></a> Revision Management

#### <a name="symbols-import-export"></a> Export & Import

### <a name="learning-experiment-modeling"></a> Learning Experiment Modeling

#### <a name="learning-experiment-modeling-hypothesis-interaction"></a> Hypothesis Interaction

#### <a name="learning-experiment-modeling-internal-data-structures"></a> Internal Data Structures
 
#### <a name="learning-experiment-modeling-counterexamples"></a> Counter Example Testing

### <a name="learning-experiment-analysis"></a> Learning Experiment Analysis

#### <a name="learning-experiment-analysis-hypothesis-comparison"></a> Hypotheses Comparison

#### <a name="learning-experiment-analysis-statistics"></a> Statistics


Try the REST API
----------------

