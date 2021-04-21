# ALEX 2.1.1

## Fixes

* Fix bug where test cases could not be executed.
* Fix bug where tests could not be saved when pre steps have changed.


# ALEX 2.1.0

## Breaking Changes

* Use Docker for development and production versions of ALEX.
  The standalone build is no longer supported.
* Due to the previous point, the web drivers have been removed.
  It is only possible to set the URL to a Selenium Hub.

## Features

* See which symbols and tests are used by other users in a project
* Export formula suites while exporting a project
* Export learner setups while exporting a project
* Automated model checking of learned models
    * Associate LTL formula suites with a learner setup

# ALEX 2.0.0

## Fixes

* Scoping issues with variables

## Improvements

* Add Flyway support
* Migrate frontend to Angular 8 
* Server-side import and export
* Add stack trace for failed tests
* Abort test processes more quickly 
* Show symbol references
* Support for Java 11

## Features

* Project environments: create environments and environment variables 
* New actions:
    * Drag and drop operations
    * goto-like jumps
    * waiting for a script
* Update a test suite during test generation
* Extend "switch to" action for handling windows
* Import and export for projects
* Specify default test configurations
* Multiple pre and post steps for test cases
* Queue test and learning processes
* Save learning setups
* Collaboration for projects

# ALEX 1.7.2

## Fixes

* Generate test case from model
* Add cookie to request action

# ALEX 1.7.1

## Fixes

* Fix model not displayed in testing view

# ALEX 1.7.0

## Breaking Changes

* Removed the HTML Element Picker.
  The picker only really worked in Chrome and then only in some selected use cases, i.e. static pages.
  Due to these restrictions we decided to remove it completely.
* Removed xvfb option.
  The option was introduced when major browsers did not have a headless mode.
  Since the option only worked on Linux systems and all major browsers have such a mode, the option has been removed.

## Features

* Basic LTL-based model checking using [LTSmin](https://ltsmin.utwente.nl/).
* Compatibility with Java > 8.
* Add action to set a variable by HTTP status.
* Improved parallelisation support for learning processes.
* Permanently delete symbols instead of just hiding them.
  This only works if a symbol is not referenced by some other entity.
* Symbol groups can have the same name when they don't share the parent group.
* New events for when symbols are deleted permanently.
* New model checker related events.
* The JWT expires after 7 days.

## Fixes

* Test results are ordered properly.
* Fix resuming learning processes with new input symbols.


# ALEX 1.6.1

## Fixes

* Fix issues with HTML Element Picker


# ALEX 1.6.0

## Breaking Changes

* Symbols have to be migrated to the new version.
  Please use the migration script `src/main/resources/migration/1.6.0/migrate-symbols-1.5.0-to-1.6.0.js` via:
  
  `node migrate-symbols-1.5.0-to-1.6.0.js ./symbols-from-1.5.0.json ./symbols-for-1.6.0.json`
  
* Tests have to be migrated to the new version.
  Please use the migration script `src/main/resources/migration/1.6.0/migrate-tests-1.5.0-to-1.6.0.js` via:
     
  `node migrate-tests-1.5.0-to-1.6.0.js ./tests-from-1.5.0.json ./tests-for-1.6.0.json`
     
## Features

* Symbols can be composed of other symbols.
* Symbols can be parameterized in learning experiments.
* Connect ALEX to a MySQL database.
  See the README for instructions.
* Generate test suites from discrimination tree based learners (TTT, Discrimination Tree).
* Use test cases in test suites as equivalence oracle.
* Added support for Internet Explorer
* Execute JavaScript asynchronously
* Symbol parameters can be *public* or *private*.
  If a parameter is public, its value can be set by the user while configuring a testing or learning process.
  If it is private, its value cannot be set manually, but is resolved by the value in the global data context.


# ALEX 1.5.1

This release only contains some bug fixes.


# ALEX 1.5.0

## Breaking Changes

* Symbols and tests that have been exported with v.1.4.0 and lower can not be imported directly.
  Apply the new export format and for each symbol in an exported JSON file add the properties `inputs` and `outputs` so that the resulting file looks like:
    
  ```JSON
  {
    "version": "1.4.0",
    "type": "symbols",
    "symbols": [
      {
        "name": "symbol",
        ...,
        "inputs": [],
        "outputs": []
      },
      ...
    ]
  }
  ```

## Bug Fixes

* Resuming a learning process should now work as expected.
* Various smaller fixes.

## Features

* The results of test executions are saved in reports.
* Added webhooks to notify external applications about changes.
* Reuse the browser instance for membership queries. 
  A hard reset with a new browser instance can be achieved with a new action.
* New actions: 
    * Refresh and restart the browser window.
    * Click on a arbitrary element with a given visible text.
    * Check if an element, e.g. a checkbox, radio button or option is selected.
    * Set variable to HTTP response body.
* Parameterized symbols: symbols now have dynamic inputs and outputs.
  Values for inputs can be set by a user for modelling tests.
* Symbols and symbol groups can be nested in a tree like structure.
* Named project URLs.
* Download uploaded files.
* Learner results can be cloned.
* Import and export symbol groups.

## Further Comments

* The CLI for ALEX is now a standalone NPM package and can be installed via `npm install alex-cli`


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
* Added Safari driver
* New actions:
    * Wait for a text to appear
    * Wait for the value of an elements attribute
    * Interact with alert, prompt and confirm dialogs
    * Validate JSON against a JSON schema
    
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
