#### [Simple User Interface][webpicker] ###

[![Web Picker Example](images/webpicker.jpg)][webpicker]

Define user interaction with your web application in a clean and easy to use editor.
ALEX offers over 20 different actions to simulate the user interaction.

[webpicker]: features.html#webpicker


#### [Watch Hypotheses][hypotheses] ###

[![Hypotheses View](images/models.jpg)][hypotheses]

Take a look at the learned hypothesis of the test run, even side by side for easier comparison.
Those models can be exported as JSON or vector graphics.

[hypotheses]: usage.html#results


#### [Compare Statistics][statistics] ###

[![Statistics View](images/statistics.jpg)][statistics]

Compare the different statistics of differnt learning processes or within on test run.
It is also possible to export those statistics for further research.

[statistics]: usage.html#statistics


#### [Extensive REST API][rest-api] ###

[![REST API documentation in Swagger UI](images/swagger.jpg)][rest-api]

ALEX can be used over a REST API and without any front end at all.
Swagger is used provide extensive documentation if its REST API. 

[rest-api]: main/REST.html


---


<b>A</b>utomata <b>L</b>earning <b>EX</b>perience (ALEX) offers a new way to test web applications.
Instead of testing a web application with only some typical use cases, just define each step and let ALEX create a 
model of the application.
This model can be used to validate the behaviour of the web application.
It is not required to have knowledge of a specifc language, because ALEX defines a new way to describe user interaction.
It is possible to test the web application over the web interface or the REST API of the applications.
This allows to see if both interfaces work together as intended.
ALEX can be easily integrated in existing workflow, because everything can be done over a powerful REST API.


---


## Learn More ##
Like to learn more about ALEX?
What [features][features] are included and how you can [use ALEX][usage]?
Or maybe even about the [theory][learning-doc] behind it.
Than take a look at the following links:

[Take a look on the overview of the features &raquo;][features]

[Read more in the full documentation &raquo;][usage]

[More information about Active Automata Learning &raquo;][learning-doc]

[features]: features.html
[learning-doc]: automata-learning.html
[usage]: usage.html


## Build ALEX ##
Read all about the [building process][build-doc] of ALEX.
The short version is simple run the command:

```bash
./build.sh
```

[Full documentation of the build process &raquo;][build-doc]

[build-doc]: build.html
