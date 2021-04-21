(window.webpackJsonp=window.webpackJsonp||[]).push([[6],{327:function(e,t,a){e.exports=a.p+"assets/img/auth-2.d62c103f.jpg"},362:function(e,t,a){e.exports=a.p+"assets/img/auth-1.61829e9e.jpg"},363:function(e,t,a){e.exports=a.p+"assets/img/learning-error.9a3560ff.jpg"},435:function(e,t,a){"use strict";a.r(t);var s=a(45),o=Object(s.a)({},(function(){var e=this,t=e.$createElement,s=e._self._c||t;return s("ContentSlotsDistributor",{attrs:{"slot-key":e.$parent.slotKey}},[s("h1",{attrs:{id:"best-practices"}},[s("a",{staticClass:"header-anchor",attrs:{href:"#best-practices"}},[e._v("#")]),e._v(" Best practices")]),e._v(" "),s("p",[e._v("In this section, some of the best practices for using ALEX are written down.\nThese rely on our own experiences while modeling and learning several web applications.")]),e._v(" "),s("h2",{attrs:{id:"symbol-modeling"}},[s("a",{staticClass:"header-anchor",attrs:{href:"#symbol-modeling"}},[e._v("#")]),e._v(" Symbol modeling")]),e._v(" "),s("p",[e._v("When modeling input symbols, the granularity of modeling your application matters and it is advised that you "),s("strong",[e._v("think in use cases")]),e._v(".\nHere is the reason why:")]),e._v(" "),s("p",[e._v("For example, if you create an input symbol for each possible click on each link or button, you will have a very detailed and big model of your application's behavior.\nHowever, the verification of specifications will not be that easy.\nAdditionally, learning will usually take much longer as the number of symbols grows.")]),e._v(" "),s("p",[e._v("In contrast to that, you should not treat a symbol as a whole integration test.\nFor example you could create a symbol "),s("em",[e._v("TestAuthenticationSystem")]),e._v(" that creates a user, logs him in and then out.\nThis has several disadvantages.\nYou do not test at any other point of your application if a logout is possible without explicitly modeling it twice.\nFurthermore, the learned model will most likely not represent your "),s("em",[e._v("real system")]),e._v(" very accurately.")]),e._v(" "),s("p",[e._v("Instead, we think it is good if you create something in between those extremes.\nAs already mentioned, try modelling "),s("strong",[e._v("use cases")]),e._v(" of your application.\nAs an example, have a look at Wordpress.\nPossible symbols could be:")]),e._v(" "),s("ul",[s("li",[e._v("Login")]),e._v(" "),s("li",[e._v("Logout")]),e._v(" "),s("li",[e._v("Create a post")]),e._v(" "),s("li",[e._v("Publish a post")]),e._v(" "),s("li",[e._v("Mark a comment as spam")]),e._v(" "),s("li",[e._v("...")])]),e._v(" "),s("p",[e._v("Each point can be modeled as an input symbol and the learned model will tell you clearly what is possible and what is not while still be able to easily find possible errors in an application.")]),e._v(" "),s("h2",{attrs:{id:"modeling-authentication-systems"}},[s("a",{staticClass:"header-anchor",attrs:{href:"#modeling-authentication-systems"}},[e._v("#")]),e._v(" Modeling authentication systems")]),e._v(" "),s("slides",[s("slide",{attrs:{title:"HTTP Basic Auth"}},[s("template",{slot:"image"},[s("img",{attrs:{src:a(362)}})]),e._v(" "),s("template",{slot:"text"},[e._v("\n            The "),s("em",[e._v("Make request")]),e._v(" action and the "),s("em",[e._v("Open URL")]),e._v(" action both support the specification of credentials, consisting of a login and a password, in order to use basic HTTP auth.\n        ")])],2),e._v(" "),s("slide",{attrs:{title:"JSON Web Tokens (JWT)"}},[s("template",{slot:"image"},[s("img",{attrs:{src:a(327)}})]),e._v(" "),s("template",{slot:"text"},[e._v("\n            JWTs are usually used to authenticate against REST APIs by sending an encoded token in the "),s("em",[e._v("Authorization")]),e._v(" header, like "),s("code",[e._v("Authorization: Bearer TOKEN")]),e._v(". \n            In ALEX, you can specify HTTP headers in the "),s("em",[e._v("Make request")]),e._v(" action.\n            It usually makes sense to store the JWT in a variable and let ALEX insert it dynamically, like in the image above.\n        ")])],2),e._v(" "),s("slide",{attrs:{title:"Cookies"}},[s("template",{slot:"image"},[s("img",{attrs:{src:a(327)}})]),e._v(" "),s("template",{slot:"text"},[e._v("\n            In the "),s("em",[e._v("Make request")]),e._v(" and in the "),s("em",[e._v("Open URL")]),e._v(" action you can specify both, cookies and additional HTTP header fields, if necessary.\n            A common method to use cookies is to authenticate via the web interface and use the cookie for REST requests.\n            In order to model this, first model the login behavior via the web interface.\n            Then, use the "),s("em",[e._v("Set variable by cookie")]),e._v(" action with the "),s("em",[e._v("Browser cookie")]),e._v(" option to save the cookie.\n            After that, the cookie is stored in a available and can be used in the "),s("em",[e._v("Make request")]),e._v(" action.\n        ")])],2)],1),e._v(" "),s("h2",{attrs:{id:"resetting-an-application"}},[s("a",{staticClass:"header-anchor",attrs:{href:"#resetting-an-application"}},[e._v("#")]),e._v(" Resetting an application")]),e._v(" "),s("p",[e._v("While learning, sequences of symbols are created and executed on your application.\nWe assume that your application behaves input deterministically, i.e. each sequence that is executed will always yield the same output.\nAs a consequence, for each sequence, the system has to be put in a state where all further executions are independent from the ones before.\nPractically, this can be done by "),s("em",[e._v("resetting")]),e._v(" the system.\nIn ALEX, the reset mechanism is modeled as a symbol that by convention we call "),s("em",[e._v("Reset")]),e._v(".\nWhat a reset looks like is up to you and depends on the application, but here are some examples:")]),e._v(" "),s("ul",[s("li",[s("p",[e._v("If you have a "),s("strong",[e._v("static web site")]),e._v(" that only consists of a few linked HTML files and you want to make sure they are linked correctly, the reset symbol could consist of an action to go to the index page.")])]),e._v(" "),s("li",[s("p",[e._v("If you have a "),s("strong",[e._v("user management system")]),e._v(" and want to test user specific features only, your reset symbol could simply consist of the creation of a new user.\nFor example if you want to test a users ability to create, update and delete a business entity, then, a reset could create a new user and log him in.\nIf he now creates a entity, his action does not interfere with actions executed by other users.")])]),e._v(" "),s("li",[s("p",[e._v("Sometimes it may be necessary to "),s("strong",[e._v("clear the database")]),e._v(" in order to remove all entities.\nSince we have no actions that connects to a database to execute queries you will have to work around that, e.g. by")]),e._v(" "),s("ol",[s("li",[e._v("creating a temporary REST endpoint that is called that resets the database, or by")]),e._v(" "),s("li",[e._v("adding a button to the frontend that is hidden in the admin panel that does the same.")])])])]),e._v(" "),s("p",[e._v("As you can see, how you model a system reset is not always trivial and is highly dependant on how the target application works and what exactly you want to test.")]),e._v(" "),s("h2",{attrs:{id:"learning-process-configuration"}},[s("a",{staticClass:"header-anchor",attrs:{href:"#learning-process-configuration"}},[e._v("#")]),e._v(" Learning process configuration")]),e._v(" "),s("p",[e._v("Before you start a learning process, you can configure some parameters like the algorithm or the equivalence oracle.\nALEX runs all tests with reasonable preconfigured settings.\nHere are some advices:")]),e._v(" "),s("ul",[s("li",[e._v("The "),s("em",[e._v("TTT")]),e._v(" algorithm usually performs best.")]),e._v(" "),s("li",[e._v("The default settings for the Random Word equivalence oracle is ok for models that you do not expect to get bigger than 4 to 6 states.\nThere is no real rule of thumb here, but if you expect your models to be bigger that that, adjust the parameters correspondingly.")]),e._v(" "),s("li",[e._v("The complete and W-method equivalence oracle can be used when you can run your tests over night or the weekend, or for a really small alphabet size.")]),e._v(" "),s("li",[e._v("Enabling the membership query cache is preferred.")]),e._v(" "),s("li",[e._v("Provide multiple URLs during the project creation so that equivalence oracles and some algorithms can perform better.")])]),e._v(" "),s("h2",{attrs:{id:"learning-javascript-enabled-applications"}},[s("a",{staticClass:"header-anchor",attrs:{href:"#learning-javascript-enabled-applications"}},[e._v("#")]),e._v(" Learning JavaScript enabled applications")]),e._v(" "),s("ul",[s("li",[e._v("When modeling symbols for JavaScript heavy websites, e.g. single page applications, make use of the "),s("em",[e._v("wait for ...")]),e._v(" actions.\nThis way, Selenium can handle dynamic changes of the DOM better.")])]),e._v(" "),s("h2",{attrs:{id:"further-remarks"}},[s("a",{staticClass:"header-anchor",attrs:{href:"#further-remarks"}},[e._v("#")]),e._v(" Further remarks")]),e._v(" "),s("p",[s("img",{attrs:{src:a(363),alt:"Learning Error"}})]),e._v(" "),s("ul",[s("li",[s("p",[e._v("Sometimes, you might get a cryptic error message while learning (like in the image above) that says something like: "),s("em",[e._v("expected symbol ok ok failed(1) but got symbol ok failed(2) ok")]),e._v(".\nThis means that the same query resulted in two different system outputs, which indicates that the system does not behave deterministically.\nMore often, the real reason is one of the following:")]),e._v(" "),s("ol",[s("li",[e._v("The reset does not really reset the application.")]),e._v(" "),s("li",[e._v("Faulty symbol modeling, triggered by a counter that has not been incremented or something like that.")]),e._v(" "),s("li",[e._v("Selenium behaves off which mostly happens in single page applications.\nRefactor the modeling of the symbol that leads to the error, e.g. increase timeouts.")]),e._v(" "),s("li",[e._v("Your system is fully occupied, thus the web browser needs longer to react than the timeouts that are specified.")]),e._v(" "),s("li",[e._v("The driver executable fails to connect to the web browser, which can happen at times.\nThe only solution here is to continue learning from the last known hypothesis.")])])])])],1)}),[],!1,null,null,null);t.default=o.exports}}]);