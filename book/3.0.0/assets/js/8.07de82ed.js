(window.webpackJsonp=window.webpackJsonp||[]).push([[8],{476:function(e,t,s){e.exports=s.p+"assets/img/testing-1.17a28805.jpg"},477:function(e,t,s){e.exports=s.p+"assets/img/testing-2.ea98ea99.png"},478:function(e,t,s){e.exports=s.p+"assets/img/testing-3.041c7f2f.jpg"},514:function(e,t,s){"use strict";s.r(t);var a=s(65),n=Object(a.a)({},(function(){var e=this,t=e.$createElement,a=e._self._c||t;return a("ContentSlotsDistributor",{attrs:{"slot-key":e.$parent.slotKey}},[a("h1",{attrs:{id:"testing"}},[a("a",{staticClass:"header-anchor",attrs:{href:"#testing"}},[e._v("#")]),e._v(" Testing")]),e._v(" "),a("p",[e._v("ALEX has integration testing abilities on board.\nSo, instead of learning, you can model and execute single test cases.\nThe corresponding functionality is available under the item "),a("strong",[e._v("Manage")]),e._v(" in the group "),a("strong",[e._v("Testing")]),e._v(" in the sidebar.")]),e._v(" "),a("p",[e._v("We differentiate between test cases and test suites.\nA test case is a use case of the application and is modelled via a sequence of symbols.\nA test suite bundles multiple test cases.\nYou can navigate through all test cases and test suites like in a typical directory structure.\nTest cases are indicated by a file icon, test suites by a folder icon.")]),e._v(" "),a("p",[a("img",{attrs:{src:s(476),alt:"Testing"}})]),e._v(" "),a("p",[e._v("The option to create a test case or a test suite is available in the dropdown menu "),a("span",{staticClass:"label"},[e._v("1")]),e._v(".\nThe name of a test case has to be unique within the parent test suite.\nThis means that it is possible to have multiple test cases with the same name as long as they are in different groups.")]),e._v(" "),a("p",[e._v("Via "),a("span",{staticClass:"label"},[e._v("2")]),e._v(", you can navigate directly in the test suite.\nClicking on a test case redirects you to a view where the test case can be modelled, which is covered in the next section.\n"),a("span",{staticClass:"label"},[e._v("3")]),e._v(" allows you to copy and paste test cases and test suites.")]),e._v(" "),a("p",[e._v("For executing tests setup more quickly, select the tests you want to execute and save the current configuration with "),a("span",{staticClass:"label"},[e._v("4")]),e._v(".")]),e._v(" "),a("h2",{attrs:{id:"test-cases"}},[a("a",{staticClass:"header-anchor",attrs:{href:"#test-cases"}},[e._v("#")]),e._v(" Test cases")]),e._v(" "),a("p",[a("img",{attrs:{src:s(477),alt:"Testing"}})]),e._v(" "),a("p",[e._v("A test case consists of:")]),e._v(" "),a("ul",[a("li",[a("p",[e._v("A list of "),a("strong",[e._v("Pre steps")]),e._v(" which are actions that are used to initialize the test, e.g. to clear the system and to create necessary data.\nIf one of the pre steps fails, the execution is aborted and the test is considered failed.\nSteps can be added to the list of pre steps via drag and drop.")])]),e._v(" "),a("li",[a("p",[e._v("A list of "),a("strong",[e._v("Steps")]),e._v(" which is the list of symbols that model the actual test case.\nIn order to model the test, click together a sequence of symbols from the symbol tree on the left.\nYou can always reorder the symbols in the test by drag-and-drop.")])]),e._v(" "),a("li",[a("p",[e._v("A list of "),a("strong",[e._v("Post steps")]),e._v(" which are actions that can be used to clean up after the test.\nThe test will not fail, if one of the post steps can not be executed.\nFurther, steps can be added to the list of post steps via drag and drop.")])])]),e._v(" "),a("p",[e._v("If a symbol has input parameters defined, they are displayed in the corresponding step.\nAt first, they are assigned a null value which indirectly means that the values are read from the global data context that is created during the execution of the test.\nIf you specify a value yourself, that value overwrites the value from the global context.")]),e._v(" "),a("p",[e._v("A test always has to pass and it passes, if the "),a("strong",[e._v("Expected output")]),e._v(" matches the "),a("strong",[e._v("Actual output")]),e._v(" column for all steps.\nIt fails if the execute of one of its steps fails and the remaining steps are not executed.")]),e._v(" "),a("h3",{attrs:{id:"changing-the-expected-output"}},[a("a",{staticClass:"header-anchor",attrs:{href:"#changing-the-expected-output"}},[e._v("#")]),e._v(" Changing the expected output")]),e._v(" "),a("p",[e._v("Sometimes, you want to assert that an certain step can not be executed.\nInstead of modeling an additional symbol, you can change the expected output.\nBy clicking on the value in the "),a("strong",[e._v("Expected output")]),e._v(" column, you can negate the expected result.")]),e._v(" "),a("h3",{attrs:{id:"disabling-steps"}},[a("a",{staticClass:"header-anchor",attrs:{href:"#disabling-steps"}},[e._v("#")]),e._v(" Disabling steps")]),e._v(" "),a("p",[e._v("For debugging purposes, it can be useful to disable steps.\nThe toggle button in each row allows that.\nA step that is disabled is skipped during the test execution.")]),e._v(" "),a("h2",{attrs:{id:"executing-tests"}},[a("a",{staticClass:"header-anchor",attrs:{href:"#executing-tests"}},[e._v("#")]),e._v(" Executing tests")]),e._v(" "),a("p",[a("img",{attrs:{src:s(478),alt:"Testing"}})]),e._v(" "),a("p",[e._v("Back in the overview, select the test cases and test suites that should be executed.\nThe button group "),a("span",{staticClass:"label"},[e._v("1")]),e._v(" behaves like in the test case view.")]),e._v(" "),a("p",[e._v("When the execution finished, labels beside each test case and test suite indicate its result.\nA yellow label indicates that some, but not all test cases inside the test suite did not pass.")]),e._v(" "),a("p",[e._v("Below the list, The result over all tests is displayed in a table "),a("span",{staticClass:"label"},[e._v("2")]),e._v(".\nThe results of the test execution are not saved in the database in the current version of ALEX, but you can export the results as a "),a("em",[a("a",{attrs:{href:"https://www.ibm.com/support/knowledgecenter/en/SSQ2R2_9.5.0/com.ibm.rsar.analysis.codereview.cobol.doc/topics/cac_useresults_junit.html",target:"_blank",rel:"noopener noreferrer"}},[e._v("JUnit XML Report"),a("OutboundLink")],1)]),e._v(".")]),e._v(" "),a("h2",{attrs:{id:"test-reports"}},[a("a",{staticClass:"header-anchor",attrs:{href:"#test-reports"}},[e._v("#")]),e._v(" Test reports")]),e._v(" "),a("p",[e._v("For each executed test case or test suite, a test report is created.\nAll reports of all tests can be found under "),a("strong",[e._v("Testing > Reports")]),e._v(" in the sidebar in descending order.\nTo get details of a report, click on the "),a("strong",[e._v("Details")]),e._v(" link in the corresponding column of a test run.")]),e._v(" "),a("p",[e._v("For test results of an individual test:")]),e._v(" "),a("ol",[a("li",[e._v("Navigate to "),a("strong",[e._v("Testing > Manage")]),e._v(" in the sidebar")]),e._v(" "),a("li",[e._v("Navigate to the test suite that contains the test of interest")]),e._v(" "),a("li",[e._v("In the dropdown menu of the corresponding test, click on "),a("strong",[e._v("Results")])])]),e._v(" "),a("p",[e._v("There, all individual test reports for a single test case are listed in descending order.")])])}),[],!1,null,null,null);t.default=n.exports}}]);