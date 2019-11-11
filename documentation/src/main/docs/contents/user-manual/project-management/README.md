# Project management

Projects are the entities that are used to manage multiple target applications in ALEX. 
You can, for example, create a project for your application in version *x* and another one for version *x+1* while having a different sets of input symbols.
A project is bound to the user that created it and can not be shared between other users.

![Overview](./assets/overview.jpg)

After the login, you will see an overview of all created projects like depicted above.


## Creating, editing and deleting projects

In order to create a new project, fill out the form on the left. 
A new project has the following properties:

| Field       | Description                                                                            | Required |
|-------------|----------------------------------------------------------------------------------------|----------|
| Name        | A unique name for the  project.                                                        | yes      |
| URL         | The URL of the system                                                                  | yes      |
| Description | A description of the  project.                                                         | no       |

The URL of a new project has to start with *http://* or *https://* followed by at least one further character for the host. 
The URL can, but does not have to end with a trailing '/'. 

![Settings](./assets/settings.jpg)

If you want to edit a project, click on <span class="label">1</span> and a modal window will pop up where the same form as for the creation is displayed.

Deleting and updating projects can be done under the premise that there is no active learning process with the project.
Before deleting a project, make sure you have exported your symbols, hypotheses and/or statistics because with the deletion of a project, all these entities are deleted from the database, too.


## Working with a project

Most aspects of ALEX require that a project is *opened*, which means that is has been selected from the project list. 
It is then saved in the *sessionStorage* of the web browser, so that, in case of a page refresh, the project does not have to be opened again. 
You can select a project you want to work with it by clicking on <span class="label">2</span> which will redirect you to the dashboard of the project (see picture below).

![Dashboard](./assets/dashboard.jpg)

The dashboard displays some information about the project itself, an indicator for the state of a running learning process and a quick link to the latest learner result.

In order to switch to another project you have to close the current one first. 
The button for this action can be found in the menu under the navigation point with the name of the opened project <span class="label">3</span>. 
It redirects back to the project overview. 
Since the current project is persisted per tab, working on multiple projects simultaneously is possible by loading ALEX in another browser tab.


## Project environments

Project environments give you the option to execute tests and learning processes against multiple system environments.
Each environment can have a set of named **base URLs** and **environment variables**.
URLs are used as a base URL in certain actions, such as in the *Open URL* and *Request* action.
Variables can used in any action with the following notation, similar to how variables and counters are used:

<div style="text-align: center">
`{{:VAR_NAME}}`
</div>