(function () {
    'use strict';

    angular
        .module('ALEX.core')
        .directive('widget', widget)
        .directive('counterexamplesWidget', counterexamplesWidget)
        .directive('learnResumeSettingsWidget', learnResumeSettingsWidget);

    widget.$inject = ['paths'];
    counterexamplesWidget.$inject = ['paths', 'CounterExampleService', 'LearnerService', 'ToastService',
        'outputAlphabet', 'SymbolResource'];
    learnResumeSettingsWidget.$inject = ['paths', 'EqOracle'];


    /**
     * The directive for displaying a widget without content. Use is a a wrapper for any content you like.
     *
     * Attribute 'title' {string} can be applied for displaying a widget title.
     *
     * Use: '<widget title="..."></widget>'
     *
     * @param paths - The applications constant for paths
     * @returns {{scope: {title: string}, templateUrl: string, transclude: boolean, link: link}}
     */
    function widget(paths) {
        return {
            scope: {
                title: '@'
            },
            templateUrl: paths.COMPONENTS + '/core/views/directives/widget.html',
            transclude: true,
            link: link
        };

        function link(scope) {

            /**
             * The title that should be displayed in the widget header
             * @type {string}
             */
            scope.title = scope.title || 'Untitled';
        }
    }


    /**
     * The directive for the content of the counterexample widget that is used to create and test counterexamples.
     * Should be included into a <widget></widget> directive for visual appeal.
     *
     * Attribute 'counterexamples' {array} should be the model where the created counterexamples are put into.
     *
     * Use: '<div counterexamples-widget counterexamples="..."></div>'
     *
     * @param paths - The application paths constant
     * @param CounterExampleService - The service for sharing a counterexample with a hypothesis
     * @param Learner - The LearnerService for communication with the Learner
     * @param Toast - The ToastService
     * @param outputAlphabet - The dictionary for the output alphabet
     * @param SymbolResource
     * @returns {{scope: {counterexamples: string}, templateUrl: string, link: link}}
     */
    function counterexamplesWidget(paths, CounterExampleService, Learner, Toast, outputAlphabet, SymbolResource) {
        return {
            scope: {
                counterexamples: '=',
                learnResult: '='
            },
            templateUrl: paths.COMPONENTS + '/core/views/directives/counterexamples-widget.html',
            link: link
        };

        function link(scope) {

            var symbols = [];

            /**
             * The array of input output pairs of the shared counterexample
             * @type {Array}
             */
            scope.counterExample = [];

            /**
             * A list of counterexamples for editing purposes without manipulation the actual model
             * @type {Object[]}
             */
            scope.tmpCounterExamples = [];

            /**
             * The dictionary for the output alphabet
             * @type {Object}
             */
            scope.outputAlphabet = outputAlphabet;

            // get the shared counterexample object
            function init() {
                scope.counterExample = CounterExampleService.getCurrentCounterexample();
            }

            // update the model
            function renewCounterexamples() {
                scope.counterexamples = scope.tmpCounterExamples;
            }

            /**
             * Removes a input output pair from the temporary counterexamples array.
             *
             * @param {number} i - The index of the pair to remove
             */
            scope.removeInputOutputAt = function (i) {
                scope.counterExample.splice(i, 1);
            };

            /**
             * Toggles the output symbol of a input output pair between OK and FAILED
             *
             * @param {number} i - The index of the pair
             */
            scope.toggleOutputAt = function (i) {
                if (scope.counterExample[i].output === outputAlphabet.OK) {
                    scope.counterExample[i].output = outputAlphabet.FAILED
                } else {
                    scope.counterExample[i].output = outputAlphabet.OK
                }
            };

            /**
             * Adds a new counterexample to the scope and the model
             */
            scope.addCounterExample = function () {
                scope.tmpCounterExamples.push(scope.counterExample);
                CounterExampleService.resetCurrentCounterexample();
                renewCounterexamples();
                init();
            };

            /**
             * Removes a counterexample from the temporary and the model
             *
             * @param {number} i - the index of the pair in the temporary list of counterexamples
             */
            scope.removeCounterExampleAt = function (i) {
                scope.tmpCounterExamples.splice(i, 1);
                renewCounterexamples();
            };

            /**
             * Sets a selected counterexamples to the current one and shares it with the service
             *
             * @param {number} i - The index of the counterexample
             */
            scope.selectCounterExampleAt = function (i) {
                CounterExampleService.setCurrentCounterexample(scope.tmpCounterExamples[i]);
                scope.removeCounterExampleAt(i);
                init();
            };

            /**
             * Tests if the entered counterexample really is one by sending it to the server for testing purposes.
             */
            scope.testCounterExample = function () {
                var resetSymbol = scope.learnResult.configuration.resetSymbol;

                if (symbols.length === 0) {
                    SymbolResource.getByIdRevisionPairs(scope.learnResult.project,
                        scope.learnResult.configuration.symbols)
                        .then(function (s) {
                            symbols = s;
                            test();
                        });
                } else {
                    test();
                }

                function test() {
                    var testSymbols = [];

                    // find id/revision pairs of symbols from abbreviation in learnResult
                    for (var i = 0; i < scope.counterExample.length; i++) {
                        for (var j = 0; j < symbols.length; j++) {
                            if (scope.counterExample[i].input === symbols[j].abbreviation) {
                                testSymbols.push(symbols[j].getIdRevisionPair());
                            }
                        }
                    }

                    Learner.isCounterexample(scope.learnResult.project, resetSymbol, testSymbols)
                        .then(function (ce) {
                            var ceFound = false;
                            for (var i = 0; i < ce.length; i++) {
                                if (ce[i].split('(')[0] !== scope.counterExample[i].output) {
                                    ceFound = true;
                                    break;
                                }
                            }
                            if (ceFound) {
                                Toast.success('The selected word is a counterexample');
                                for (i = 0; i < ce.length; i++) {
                                    scope.counterExample[i].output = ce[i].split('(')[0]; // ignore the (<number>) from FAILED output
                                }
                            } else {
                                Toast.danger('The selected word is not a counterexample');
                            }
                        })
                }
            };

            init();
        }
    }


    /**
     * The directive for the widget of the sidebar where learn resume configurations can be edited. Should be included
     * into a <div widget></div> directive for visual appeal.
     *
     * Expects an attribute 'learnConfiguration' attached to the element whose value should be a LearnConfiguration
     * object.
     *
     * Use: <div learn-resume-settings-widget learn-configuration="..."></div>
     *
     * @param paths - The constant for applications paths
     * @param EqOracle
     * @returns {{scope: {learnConfiguration: string}, templateUrl: string, link: link}}
     */
    function learnResumeSettingsWidget(paths, EqOracle) {

        // the directive
        return {
            scope: {
                learnConfiguration: '='
            },
            templateUrl: paths.COMPONENTS + '/core/views/directives/learn-resume-settings-widget.html',
            link: link
        };

        // the directives behavior
        function link(scope) {

            /**
             * The dictionary for eq oracle types
             * @type {Object}
             */
            scope.eqOracles = EqOracle.types;

            /**
             * The selected eq oracle type from the select box
             * @type {string}
             */
            scope.selectedEqOracle = scope.learnConfiguration.eqOracle.type;

            /**
             * Creates a new eq oracle object from the selected type and assigns it to the configuration
             */
            scope.setEqOracle = function () {
                scope.learnConfiguration.eqOracle = EqOracle.build(scope.selectedEqOracle);
            };
        }
    }
}());