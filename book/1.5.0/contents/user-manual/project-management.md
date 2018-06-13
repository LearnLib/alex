# Project management

Projects are the entities that are used to manage multiple target applications in ALEX. 
You can, for example, create a project for your application in version *x* and another one for version *x+1* while having a different sets of input symbols.
A project is bound to the user that created it and can not be shared between other users.

![Overview](assets/project-management/overview.jpg)

After the login, you will see an overview of all created projects like depicted above.


## Creating, editing and deleting projects

In order to create a new project, fill out the form on the left. 
A new project has the following properties:

| Field       | Description                                                                            | Required |
|-------------|----------------------------------------------------------------------------------------|----------|
| Name        | A unique name for your project.                                                        | yes      |
| URLs        | URLs where the target is reachable. At least one URL is required.                      | (yes)    |
| Description | A description of your project.                                                         | no       |

The URL of a new project has to start with *http://* or *https://* followed by at least one further character for the host. 
The URL can, but does not have to end with a trailing '/'. 
For performance reasons, a local installation of the target application is recommended.

You can specify more than one URL if you have multiple instances of the same applications.
One of the URLs has to be specified as *Default* which is used by default when learning or executing tests.
Specifying more than one URL is useful for parallelizing aspects of the learning process, thus, making it faster.
It is important that these replications do not share the same state, e.g. have their own database.

![Settings](assets/project-management/settings.jpg)

If you want to edit a project, click on <span class="label">1</span> and a modal window will pop up where the same form as for the creation is displayed.

Deleting and updating projects can be done under the premise that there is no active learning process with the project.
Before deleting a project, make sure you have exported your symbols, hypotheses and/or statistics because with the deletion of a project, all these entities are deleted from the database, too.


## Working with a project

Most aspects of ALEX require that a project is *opened*, which means that is has been selected from the project list. 
It is then saved in the *sessionStorage* of the web browser, so that, in case of a page refresh, the project does not have to be opened again. 
You can select a project you want to work with it by clicking on <span class="label">2</span> which will redirect you to the dashboard of the project (see picture below).

![Dashboard](assets/project-management/dashboard.jpg)

The dashboard displays some information about the project itself, an indicator for the state of a running learning process and a quick link to the latest learner result.

In order to switch to another project you have to close the current one first. 
The button for this action can be found in the menu under the navigation point with the name of the opened project <span class="label">3</span>. 
It redirects back to the project overview. 
Since the current project is persisted per tab, working on multiple projects simultaneously is possible by loading ALEX in another browser tab.
