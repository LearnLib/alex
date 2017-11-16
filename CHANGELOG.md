# ALEX 1.4.0

## Breaking Changes

* Symbol abbreviations have been removed. To use old exported symbol sets, remove the *abbreviation* property manually
from the JSON file.

* The HTML Element Picker does not work as before. In order to use it properly, make sure you start your browser with
disabled CORS rules or use a plugin. See the [user documentation](http://learnlib.github.io/alex/book/1.4.0/) for 
detailed instructions.

## Features

* Define a default web driver to execute tests in
* Immediately stop learning instead of waiting for the current iteration to finish
* Support for native headless web driver support for Chrome and Firefox
* Action recorder - Record a sequence of actions for a symbol in the Element Picker
* Extended testing capability - Save and execute test cases without starting a learning process
* Calculate the difference between two models
* New actions:
    * Wait for a text to appear
    * Interact with alert, prompt and confirm dialogs
    
See the [user documentation](http://learnlib.github.io/alex/book/1.4.0/) for more details.

# ALEX 1.3.0

## Breaking Changes

* The execute symbol action is no longer supported

## Features

* Possibility to resume old learning experiments

# ALEX v1.2.1

## Breaking Changes

* Actions that deal with web elements have to be updated:

    ```
        node: {selector: '...', type: 'CSS|XPATH'}
    ```

## Features

* New actions:
    * Set a variable by node count
    * Set a variable by regex
* Switch between XPath and CSS selectors in actions
* Experimental parallel test execution support

# ALEX v1.2

## Features

* New actions:
    * Press special keys like enter, ctrl, etc.
    * Check the value of an elements attribute
* New equivalence oracle: hypothesis
* Test symbols without starting a learning process
* Support for the edge driver

# ALEX v1.1.2

## Breaking Changes

* Dropped support for IE web driver
* Firefox and Chrome drivers are not supported by default any longer.
  Instead, you have specify the paths to the driver executables.

## Bug Fixes

* Fixed the parsing of JSON paths in various REST actions.

## Features

* New action: Move mouse
* Click action supports double click

# ALEX v1.1 (and hidden ALEX v1.1.1)

## Bug Fixes

* Allow symbol groups to be edited via the frontend again
* Properly close connectors after finished learning
* ALEX v1.1.1 fixed a problem with the fonts.

## Features

* New action: Execute JavaScript
* GoTo action and Call action support Basic HTTP authentication
* Export and import projects
* New REST endpoint: rest/users/batch/{ids} to delete multiple users at once
* Additional visual enhancements

## Other

* Updated frontend and backend dependencies
* Removed requirement to have grunt and grunt-cli installed globally