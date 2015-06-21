Build ALEX
==========
This page documents the whole build process of ALEX.
From the necessary tools that must be installed on the building system, up to the final packages.


Requirements
------------
Before ALEX can be build some other tools must be installed on the building system.
Please make also sure that the right versions are provided.

* [Java][] (Version 8)
* [Maven][] (Version 3.3 is recommended)
* [Node.JS & NPM][nodejs] (Version 0.12)
* [Grunt CLI][grunt] (Version 0.1.13)

If *[Node.JS][nodejs]* is installed *[Grunt CLI][grunt]* can be installed by running `npm install -g grunt-cli`.

[java]:   https://java.com
[maven]:  https://maven.apache.org
[nodejs]: https://nodejs.org
[grunt]:  http://gruntjs.com


Build Process
-------------
If all those requirements are fulfilled, ALEX can be build.
There are two possible ways to build ALEX: Either fully automated or by hand.

### Automated
The simplest and recommended way on Unix machines is to use the build script.
Go to the root directory of ALEX and simply run:

```bash
chmod +x scripts/build.sh
./scripts/build.sh
```

This will check all dependencies and take care of all steps needed to build ALEX.
After this script is finished pleas take a look at [Running ALEX](#running) for further information.

### Manual
Instead of running the automated script it is of course possible to execute all necessary steps manually.

Go to `main/src/main/webapp` and install all necessary node modules.
When all dependencies are installed, the task manager `grunt` will work without errors.
This command also generates some compact files for the app.

```bash
cd main/src/main/webapp
npm install
grunt
```

Back in the root directory run maven `mvn install` once.
This can take quite some time.

```bash
cd ../../../..
mvn install
```


<a name="running"></a>Running ALEX
----------------------------------
After this ALEX is created as *alex.war* in the target directory of the *main* module.
This file can be deployed to any Jetty sever.
To make this process easier a *standalone.jar* is build within the target directory of the *standalone* module. 
