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

```bash
mvn install
```

<a name="running"></a>Running ALEX
----------------------------------
After this ALEX is created as *ALEX.war* in the target directory of the *main* module.
This file can be deployed to any Jetty sever.
To make this process easier a *standalone.jar* is build within the target directory of the *standalone* module. 

```bash
cd main
mvn jetty:run
```

You can change the port the server will use by adding `-Djetty.port=PORT` to the last command.
If you want to change the driver, user the driver option `-Ddriver=DRIVER`, where *DRIVER* is either "firefox",
"chrome", "ie", "htmlunit". Default is the headless "htmlunit" driver

Building a Release
------------------
To build ALEX into an archive two commands are needed:

```bash
mvn clean package
mvn site assembly:single -P release
```

Afterwards the *ALEX-xxx.tar.gz* archive is created in the `target` directory.
