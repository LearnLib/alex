(window.webpackJsonp=window.webpackJsonp||[]).push([[3],{436:function(e,t,s){e.exports=s.p+"assets/img/learner-setup-1.063c1ff2.png"},437:function(e,t,s){e.exports=s.p+"assets/img/learner-setup-2.0d6cd1ae.png"},438:function(e,t,s){e.exports=s.p+"assets/img/learning-1.d0fe7148.jpg"},439:function(e,t,s){e.exports=s.p+"assets/img/learning-2.4595c3b7.jpg"},440:function(e,t,s){e.exports=s.p+"assets/img/sample-1.1e7bb236.jpg"},441:function(e,t,s){e.exports=s.p+"assets/img/sample-2.09ccc5b9.jpg"},442:function(e,t,s){e.exports=s.p+"assets/img/resuming-1.4d6fa43e.jpg"},443:function(e,t,s){e.exports=s.p+"assets/img/resuming-2.2c5ffbd8.jpg"},444:function(e,t,s){e.exports=s.p+"assets/img/resuming-3.9ce1f361.jpg"},445:function(e,t,s){e.exports=s.p+"assets/img/results-compare-1.9adc7c86.jpg"},446:function(e,t,s){e.exports=s.p+"assets/img/results-compare-2.654497ba.jpg"},447:function(e,t,s){e.exports=s.p+"assets/img/results-compare-3.0a6255d9.jpg"},448:function(e,t,s){e.exports=s.p+"assets/img/results-compare-4.85ef950f.jpg"},449:function(e,t,s){e.exports=s.p+"assets/img/statistics-1.3108a08a.jpg"},450:function(e,t,s){e.exports=s.p+"assets/img/statistics-2.76aea7c6.jpg"},451:function(e,t,s){e.exports=s.p+"assets/img/statistics-3.678269c3.jpg"},452:function(e,t,s){e.exports=s.p+"assets/img/statistics-4.488847b3.jpg"},453:function(e,t,s){e.exports=s.p+"assets/img/counters-1.cf7959f2.jpg"},454:function(e,t,s){e.exports=s.p+"assets/img/counters-2.6932003d.jpg"},455:function(e,t,s){e.exports=s.p+"assets/img/counters-3.a316388a.jpg"},456:function(e,t,s){e.exports=s.p+"assets/img/counters-4.61a6bb76.jpg"},510:function(e,t,s){"use strict";s.r(t);var a=s(65),n=Object(a.a)({},(function(){var e=this,t=e.$createElement,a=e._self._c||t;return a("ContentSlotsDistributor",{attrs:{"slot-key":e.$parent.slotKey}},[a("h1",{attrs:{id:"learning"}},[a("a",{staticClass:"header-anchor",attrs:{href:"#learning"}},[e._v("#")]),e._v(" Learning")]),e._v(" "),a("h2",{attrs:{id:"creating-a-learner-setup"}},[a("a",{staticClass:"header-anchor",attrs:{href:"#creating-a-learner-setup"}},[e._v("#")]),e._v(" Creating a learner setup")]),e._v(" "),a("p",[e._v("In order to start learning an application, a learner setup has to be configured.\nSuch a setup always consists of the following components:")]),e._v(" "),a("ul",[a("li",[e._v("An input alphabet (set of symbols)")]),e._v(" "),a("li",[e._v("A symbol to reset the application")]),e._v(" "),a("li",[e._v("A learning algorithm")]),e._v(" "),a("li",[e._v("A parametrized equivalence oracle")]),e._v(" "),a("li",[e._v("A list of target URLs")]),e._v(" "),a("li",[e._v("A web browser")])]),e._v(" "),a("p",[a("img",{attrs:{src:s(436),alt:"Learning"}})]),e._v(" "),a("p",[e._v("In the setup view ("),a("strong",[e._v("Learning > Setup")]),e._v("), the list of created learner setups is displayed.\nTo create a new setup, click on the "),a("em",[e._v("New Setup")]),e._v("-button.")]),e._v(" "),a("p",[a("img",{attrs:{src:s(437),alt:"Learning"}})]),e._v(" "),a("ol",[a("li",[e._v("Select a symbol that works as a system reset in the "),a("strong",[e._v("Reset")]),e._v("-section")]),e._v(" "),a("li",[e._v("Select all symbols that should be included in the input alphabet from the tree view in the left column")]),e._v(" "),a("li",[e._v("Optionally, select a symbol in the "),a("strong",[e._v("Post")]),e._v("-section.\nThis symbol will be executed after each membership query.")])]),e._v(" "),a("p",[e._v("You can start the learning process with the default configuration by clicking on "),a("strong",[e._v("Start learning")]),e._v(".\nYou can, however also adjust certain settings such as the equivalence test strategy or the target web browser.\nThe corresponding settings can be configured via the tabset on the right.")]),e._v(" "),a("p",[e._v("Here, in the tab "),a("strong",[e._v("Learner")]),e._v(", select a learning algorithm first.\nPer default, the "),a("em",[e._v("TTT")]),e._v(" algorithm is preselected because it usually performs better than the other available options.")]),e._v(" "),a("p",[e._v("Then, configure the equivalence approximation strategy:")]),e._v(" "),a("definition",{attrs:{term:"Random word"}},[e._v("\n    The "),a("em",[e._v("Random Word")]),e._v(" EQ oracle approximates an equivalence query by generating random words from the input alphabet and executes them on the system. \n    The oracles expects three parameters: "),a("em",[e._v("minLength (> 0)")]),e._v(" defines the minimum length of a generated word, "),a("em",[e._v("maxLength (>= minLength)")]),e._v(" the maximum length and "),a("em",[e._v("numberOfWords (> 0)")]),e._v(" the amount of randomly generated words to test.\n")]),e._v(" "),a("definition",{attrs:{term:"Complete"}},[e._v("\n    The "),a("em",[e._v("Complete")]),e._v(" EQ oracle generates all possible words from an alphabet within some limits. \n    "),a("em",[e._v("minDepth (> 0)")]),e._v(" describes the minimum length of word, "),a("em",[e._v("maxDepth (>= minDepth)")]),e._v(" the maximum length.\n")]),e._v(" "),a("definition",{attrs:{term:"W-Method"}},[e._v("\n    The "),a("em",[e._v("W-Method")]),e._v(" EQ oracle generates words based on a transition coverage of the graph under the assumption of "),a("em",[e._v("maxDepth")]),e._v(" additional states.\n")]),e._v(" "),a("definition",{attrs:{term:"Sample"}},[e._v("\n    If this oracle is chosen, counterexamples are searched and specified manually by the user.\n")]),e._v(" "),a("definition",{attrs:{term:"Hypothesis"}},[e._v("\n    Uses an ideal model of an application to search for differences and uses them as counterexamples.\n    Note that the input alphabets should be the same.\n")]),e._v(" "),a("definition",{attrs:{term:"Test Suite"}},[e._v("\n    Uses all tests in a test suite for the counterexample search.\n    Tests that do not use the same symbols from the model's input alphabet are skipped.\n    This oracle is especially useful when having generated a test suite from a previously learned model.\n")]),e._v(" "),a("p",[e._v("In the "),a("strong",[e._v("WebDriver")]),e._v(" tab you can configure which web browser is used for accessing the target web application during the learning process.\nEach web driver has individual options which are displayed once you select a web browser from the select input.")]),e._v(" "),a("p",[e._v("Under the "),a("strong",[e._v("Environments")]),e._v(" tab, all URLs that are registered to the project are listed.\nSelect the ones where membership queries should be posed to.\nIf more than one URL is selected, membership query batches will be parallelized automatically.")]),e._v(" "),a("p",[e._v("Save the configuration with a click on the "),a("strong",[e._v("Save")]),e._v("-button so that it appears in the list of learner setups or execute the setup immediately.")]),e._v(" "),a("h2",{attrs:{id:"learning-2"}},[a("a",{staticClass:"header-anchor",attrs:{href:"#learning-2"}},[e._v("#")]),e._v(" Learning")]),e._v(" "),a("p",[a("img",{attrs:{src:s(438),alt:"Learning"}})]),e._v(" "),a("p",[e._v("After having started a learning process and while the learner is active, ALEX shows you a loading screen where you find different information about the current process.\nIn the top half, several statistics and the membership queries that are being executed at the moment are displayed.\nBelow, the current state of the model is displayed.\nYou can navigate through all intermediate models "),a("span",{staticClass:"label"},[e._v("1")]),e._v(" or view details about the current step, change the layout of the model and export the model in the menu "),a("span",{staticClass:"label"},[e._v("2")]),e._v(".")]),e._v(" "),a("p",[e._v("Hypotheses are represented as Mealy machines and represent the learned behavior of the target application.\nNodes are labeled from "),a("em",[e._v("0")]),e._v(" to "),a("em",[e._v("n")]),e._v(", where nodes represent the internal states of the target application and state "),a("em",[e._v("0")]),e._v(" (visualised by a green node) is the initial state.\nEdges denote transitions from one state to another where the edge labels show the symbols whose execution led to the transition into another state.\nEdge labels have the following pattern:")]),e._v(" "),a("ul",[a("li",[e._v("<symbolName> / Ok")]),e._v(" "),a("li",[e._v("<symbolName> / Failed (<number>)")]),e._v(" "),a("li",[e._v("<symbolName> / <customOutput>")])]),e._v(" "),a("p",[e._v('where <symbolName> is the name of the symbol and the text after the "/" displays the output of the system.\nIn ALEX, the output of the system is interpreted as '),a("em",[e._v('"Ok"')]),e._v(", if all actions of a symbol have been executed successfully.\nOn the other hand "),a("em",[e._v('"Failed (n)"')]),e._v(" means that the execution failed on the "),a("em",[e._v("n")]),e._v("-th action of the symbol.\nAs you may remember, in a previous section we introduced the possibility to define custom outputs.\nCustom success or error outputs for a symbol have a higher priority over the default ones.")]),e._v(" "),a("p",[a("img",{attrs:{src:s(439),alt:"Learning"}})]),e._v(" "),a("p",[e._v("After some time, when no more counterexamples can be found, the learner finishes and the final hypothesis is presented like above.\nFrom here on, you can, if you find it necessary, configure how the learning process should be continued.\nYou can also select the equivalence oracle "),a("em",[e._v("Sample")]),e._v(" and search for counterexamples by yourself, which is explained in the following.")]),e._v(" "),a("h3",{attrs:{id:"stopping-a-learning-process"}},[a("a",{staticClass:"header-anchor",attrs:{href:"#stopping-a-learning-process"}},[e._v("#")]),e._v(" Stopping a learning process")]),e._v(" "),a("p",[e._v("At each point of time during a learning process, you can abort it by clicking on the "),a("strong",[e._v("Abort")]),e._v("-button beside the loading indicator.\nAfter clicking on the button, the current membership query (batch) is still executed, but after that, the process terminates gracefully.\nModels that have been inferred up to the point of termination are still available in the learning result.")]),e._v(" "),a("h3",{attrs:{id:"finding-counterexamples-manually"}},[a("a",{staticClass:"header-anchor",attrs:{href:"#finding-counterexamples-manually"}},[e._v("#")]),e._v(" Finding counterexamples manually")]),e._v(" "),a("p",[e._v("Beside automated strategies for finding counterexamples, there is the option to search for counterexamples by hand directly on a model.")]),e._v(" "),a("p",[a("img",{attrs:{src:s(440),alt:"Sample"}})]),e._v(" "),a("p",[e._v("Therefore, select the equivalence oracle "),a("em",[e._v("Sample")]),e._v(" from the select input in the sidebar.\nThen, click together a word by clicking on the edge labels of the hypothesis.\nAfter that, click on "),a("span",{staticClass:"label"},[e._v("1")]),e._v(" to check if the word actually is a counterexample.")]),e._v(" "),a("p",[a("img",{attrs:{src:s(441),alt:"Sample"}})]),e._v(" "),a("p",[e._v("If this is the case, a notification will pop up and the actual system output of the word will be displayed at "),a("span",{staticClass:"label"},[e._v("3")]),e._v(".\nFinally, click on the "),a("em",[e._v("Resume")]),e._v(" button to initiate the refinement of the model given your counterexample.")]),e._v(" "),a("h3",{attrs:{id:"resuming-a-previous-learning-process"}},[a("a",{staticClass:"header-anchor",attrs:{href:"#resuming-a-previous-learning-process"}},[e._v("#")]),e._v(" Resuming a previous learning process")]),e._v(" "),a("p",[e._v("The learning process usually takes a lot of time when learning models from web applications.\nThe more annoying it is if the learning process is interrupted due to various reasons and you have to start learning from the beginning.\nLuckily, there is the possibility to resume an old process from an intermediate model.")]),e._v(" "),a("p",[a("img",{attrs:{src:s(442),alt:"Resuming 1"}})]),e._v(" "),a("p",[e._v("In the results overview, expand the dropdown menu on the corresponding result and click on the item labeled by "),a("em",[e._v("Continue learning")]),e._v(" "),a("span",{staticClass:"label"},[e._v("1")]),e._v(".")]),e._v(" "),a("p",[a("img",{attrs:{src:s(443),alt:"Resuming 2"}})]),e._v(" "),a("p",[e._v("You are being redirected to the view you should be familiar with from the learning process.\nHere, simply select the step "),a("span",{staticClass:"label"},[e._v("2")]),e._v(" you want to continue learning from and configure the equivalence oracle according to your needs.\nFinally, click on "),a("span",{staticClass:"label"},[e._v("3")]),e._v(" to resume the learning process.")]),e._v(" "),a("div",{staticClass:"alert alert-info"},[e._v("\n    When resuming a learning process and using the random equivalence oracle, make sure you use a different seed that in the run before.\n    Otherwhise, membership queries are posed that have been posed before, which is not effective.\n")]),e._v(" "),a("p",[a("img",{attrs:{src:s(444),alt:"Resuming 3"}})]),e._v(" "),a("h4",{attrs:{id:"adding-new-input-symbols"}},[a("a",{staticClass:"header-anchor",attrs:{href:"#adding-new-input-symbols"}},[e._v("#")]),e._v(" Adding new input symbols")]),e._v(" "),a("p",[e._v("You can add additional input symbols that should be included in the next iteration of a learning process.\nThis allows an incremental model construction.\nIn order to do so")]),e._v(" "),a("ol",[a("li",[e._v("Resume a learning process")]),e._v(" "),a("li",[e._v("In the right sidebar, open the tab "),a("strong",[e._v("Symbols")])]),e._v(" "),a("li",[e._v("Select the symbols that you want to add.\nSymbols that are already included in the model are ignored")]),e._v(" "),a("li",[e._v("Click the "),a("strong",[e._v("Resume")]),e._v("-button.\nFor each new symbol, a new step is generated and finally, an equivalence test is performed.")])]),e._v(" "),a("h2",{attrs:{id:"test-generation"}},[a("a",{staticClass:"header-anchor",attrs:{href:"#test-generation"}},[e._v("#")]),e._v(" Test generation")]),e._v(" "),a("p",[e._v("ALEX allows you to generate test suites from a learned model automatically according to certain strategies, since each path of the model corresponds to a test case.\nFor that purpose:")]),e._v(" "),a("ol",[a("li",[e._v("Open any learned model")]),e._v(" "),a("li",[e._v("Switch to the testing view by selecting the "),a("strong",[e._v("Tests")]),e._v(" item form the select menu on the top right")])]),e._v(" "),a("p",[e._v("We differentiate between automated and manual test generation strategies.\nOne option is select sequences to generate a test case from manually:")]),e._v(" "),a("ol",{attrs:{start:"3"}},[a("li",[e._v("Click the labels on the model in the corresponding order.\nThe sequence appears in the "),a("strong",[e._v("Generate test case")]),e._v(" widget.")]),e._v(" "),a("li",[e._v("Give the test case a name and click on the "),a("strong",[e._v("Generate")]),e._v("-button.\nAs a result, the test case will be created in the root test suite.")])]),e._v(" "),a("p",[e._v("There is also the possibility to generate a test suite from the model automatically using certain strategies.")]),e._v(" "),a("ol",{attrs:{start:"3"}},[a("li",[e._v("In the "),a("strong",[e._v("Generate test suite")]),e._v(" widget, select a corresponding strategy.\nNote that the "),a("em",[e._v("Discrimination tree")]),e._v(" strategy only provides state coverage, but results in a much smaller test suite than the other methods.\nThe "),a("em",[e._v("W-Method")]),e._v(" and the "),a("em",[e._v("Wp-Method")]),e._v(" both provide state and transition coverage, but result in bigger test suites and the generation process might take longer.")]),e._v(" "),a("li",[e._v("Click on the "),a("strong",[e._v("Generate")]),e._v("-button to generate the test suite")])]),e._v(" "),a("h2",{attrs:{id:"cloning-learning-experiments"}},[a("a",{staticClass:"header-anchor",attrs:{href:"#cloning-learning-experiments"}},[e._v("#")]),e._v(" Cloning learning experiments")]),e._v(" "),a("p",[e._v("Sometimes it may be useful to copy existing learning experiments, e.g. for the purpose of testing other equivalence strategies from a previously learned step.\nTherefore")]),e._v(" "),a("ol",[a("li",[e._v("Navigate to "),a("strong",[e._v("Learning > Results")]),e._v(" in the sidebar")]),e._v(" "),a("li",[e._v("Open the menu for the corresponding learning experiment")]),e._v(" "),a("li",[e._v("Click on "),a("strong",[e._v("Clone")])])]),e._v(" "),a("h2",{attrs:{id:"result-analysis"}},[a("a",{staticClass:"header-anchor",attrs:{href:"#result-analysis"}},[e._v("#")]),e._v(" Result analysis")]),e._v(" "),a("p",[e._v("Each learning process experiment and its results, including the models, statistics etc. are saved in the database.\nThis section deals with possibilities to use the learned models for a further analysis.")]),e._v(" "),a("h3",{attrs:{id:"model-comparison"}},[a("a",{staticClass:"header-anchor",attrs:{href:"#model-comparison"}},[e._v("#")]),e._v(" Model comparison")]),e._v(" "),a("p",[a("img",{attrs:{src:s(445),alt:"Comparing 1"}})]),e._v(" "),a("p",[e._v("All results from the learning processes are saved in the database and are listed in the view under "),a("em",[e._v("Results")]),e._v(" in the group "),a("em",[e._v("Learning")]),e._v(".\nClick on the test number of a result to display the model that has been learned during the corresponding learning process.")]),e._v(" "),a("p",[a("img",{attrs:{src:s(446),alt:"Comparing 2"}})]),e._v(" "),a("p",[e._v("The view here is the same as the one that is displayed during the learning process.\nThe difference is that other models from the same project, from other projects or from a previously exported JSON file can be added and displayed side by side.\nClick on "),a("span",{staticClass:"label"},[e._v("1")]),e._v(" to open a modal window with the corresponding options.")]),e._v(" "),a("p",[a("img",{attrs:{src:s(447),alt:"Comparing 3"}})]),e._v(" "),a("p",[e._v("In ALEX, there are two options to compare two hypotheses, which are available at "),a("span",{staticClass:"label"},[e._v("2")]),e._v(".\nThe "),a("strong",[e._v("separating word")]),e._v(" is the shortest word where the output of two model differ.\nIf no separating word can be found, both models are identical.\nOn the other side, such a word can indicate two things:")]),e._v(" "),a("ol",[a("li",[e._v("Different or differently configured equivalence oracles have been used in both test runs and one did not find as many counterexamples as the other.")]),e._v(" "),a("li",[e._v("The system under learning has changed, be it because a regression between the two test runs.\nIn this case, the separating word gives you an entry point for debugging the application or it represents the change correctly.")])]),e._v(" "),a("p",[e._v("Then, you can calculate the "),a("strong",[e._v("difference")]),e._v(" between two models.\nIn contrast to the separating word, "),a("em",[e._v("all")]),e._v(" words are calculated where both models differ.\nThe result is displayed as a tree, where the paths with same suffixes have been merged for a better overview, like depicted in the picture below, where the difference is displayed in a third panel.")]),e._v(" "),a("p",[a("img",{attrs:{src:s(448),alt:"Comparing 4"}})]),e._v(" "),a("p",[e._v("There are two options for calculating the difference between two models in the dropdown menu "),a("span",{staticClass:"label"},[e._v("2")]),e._v(".\nThere are two options because of the way the difference is calculated.\nAs a basis, the transition coverage of one model is used and every word is tested on the other model.\nAs a consequence there might be different results depending on which way is used.")]),e._v(" "),a("h3",{attrs:{id:"statistics"}},[a("a",{staticClass:"header-anchor",attrs:{href:"#statistics"}},[e._v("#")]),e._v(" Statistics")]),e._v(" "),a("p",[e._v("In ALEX, some statistics about the learning processes are gathered automatically, that are:")]),e._v(" "),a("ul",[a("li",[e._v("The number of membership queries,")]),e._v(" "),a("li",[e._v("the number of equivalence queries,")]),e._v(" "),a("li",[e._v("the number of symbols that have been called and")]),e._v(" "),a("li",[e._v("the execution time.")])]),e._v(" "),a("p",[e._v("Each value is saved per learning step and separated by membership and equivalence oracle.")]),e._v(" "),a("p",[a("img",{attrs:{src:s(449),alt:"Statistics 1"}})]),e._v(" "),a("p",[e._v("In order to display statistics, go to the results overview, and click on the item "),a("span",{staticClass:"label"},[e._v("1")]),e._v(" on the corresponding result.")]),e._v(" "),a("p",[a("img",{attrs:{src:s(450),alt:"Statistics 2"}})]),e._v(" "),a("p",[e._v("Now, you will see some bar charts for the cumulated values over all learning steps.\nTo see the statistics for each individual learning step, click on "),a("span",{staticClass:"label"},[e._v("2")])]),e._v(" "),a("p",[a("img",{attrs:{src:s(451),alt:"Statistics 3"}})]),e._v(" "),a("p",[e._v("A line chart then displays the values that are listed above for each step.")]),e._v(" "),a("p",[a("img",{attrs:{src:s(452),alt:"Statistics 4"}})]),e._v(" "),a("p",[e._v("There is also the possibility to compare the statistics of multiple learning processes.\nIn this case, select all relevant results in the overview and click on "),a("span",{staticClass:"label"},[e._v("3")]),e._v(".\nThe only difference here is that the displayed values are not separated by oracle.")]),e._v(" "),a("h2",{attrs:{id:"counters"}},[a("a",{staticClass:"header-anchor",attrs:{href:"#counters"}},[e._v("#")]),e._v(" Counters")]),e._v(" "),a("p",[e._v("As you may recall, counters are integer values that are created, modified and used during a learning process and persisted in the database over multiple learning processes.")]),e._v(" "),a("p",[a("img",{attrs:{src:s(453),alt:"Counters 1"}})]),e._v(" "),a("p",[e._v("On the counters page, which you can access by clicking on the item "),a("em",[e._v("Counters")]),e._v(" "),a("span",{staticClass:"label"},[e._v("1")]),e._v(" in the sidebar, the values of existing counters can be edited and new counters can be created.")]),e._v(" "),a("p",[e._v("For creating a new counter with a preset start value, click on "),a("span",{staticClass:"label"},[e._v("2")]),e._v(" which opens a modal window.")]),e._v(" "),a("p",[a("img",{attrs:{src:s(454),alt:"Counters 2"}})]),e._v(" "),a("p",[e._v("Here, insert a unique name and the value in the input fields and click on "),a("em",[e._v("Create")]),e._v(" "),a("span",{staticClass:"label"},[e._v("3")]),e._v(".\nIf the counter has been created successfully, the modal dialog is closed and it appears in the list.")]),e._v(" "),a("p",[a("img",{attrs:{src:s(455),alt:"Counters 3"}})]),e._v(" "),a("p",[a("img",{attrs:{src:s(456),alt:"Counters 4"}})]),e._v(" "),a("p",[e._v("For editing the value of an existing counter, click on "),a("span",{staticClass:"label"},[e._v("4")]),e._v(" in the dropdown menu, update the value in the form and finally, click on "),a("em",[e._v("Update")]),e._v(".")])],1)}),[],!1,null,null,null);t.default=n.exports}}]);