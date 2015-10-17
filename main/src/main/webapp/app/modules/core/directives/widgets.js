(function () {
    'use strict';

    angular
        .module('ALEX.core')
        .directive('widget', widget)
        .directive('counterexamplesWidget', counterexamplesWidget)
        .directive('learnResumeSettingsWidget', learnResumeSettingsWidget);

    widget.$inject = ['paths'];
    counterexamplesWidget.$inject = [
        'paths', 'CounterExampleService', 'LearnerResource', 'ToastService', 'SymbolResource', '$q'
    ];
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
     * @param Learner - The LearnerResource for communication with the Learner
     * @param Toast - The ToastService
     * @param SymbolResource
     * @param $q - The angular $q service
     * @returns {{scope: {counterexamples: string}, templateUrl: string, link: link}}
     */
    function counterexamplesWidget(paths, CounterExampleService, Learner, Toast, SymbolResource, $q) {
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

            // update the model
            function renewCounterexamples() {
                scope.counterexamples = scope.tmpCounterExamples;
            }

            function init() {
                scope.counterExample = CounterExampleService.getCurrentCounterexample()
            }

            init();

            /**
             * Removes a input output pair from the temporary counterexamples array.
             *
             * @param {number} i - The index of the pair to remove
             */
            scope.removeInputOutputAt = function (i) {
                scope.counterExample.splice(i, 1);
            };

            /**
             * Adds a new counterexample to the scope and the model
             */
            scope.testAndAddCounterExample = function () {
                testCounterExample()
                    .then(function (counterexample) {
                        Toast.success('The selected word is a counterexample');

                        for (var i = 0; i < counterexample.length; i++) {
                            scope.counterExample[i].output = counterexample[i];
                        }
                        scope.tmpCounterExamples.push(scope.counterExample);
                        CounterExampleService.resetCurrentCounterexample();
                        renewCounterexamples();
                        init();
                    })
                    .catch(function () {
                        Toast.danger('The word is not a counterexample');
                    })
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
             * Tests if the entered counterexample really is one by sending it to the server for testing purposes.
             */
            function testCounterExample() {
                var resetSymbol = scope.learnResult.configuration.resetSymbol;
                var deferred = $q.defer();

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
                                if (ce[i] !== scope.counterExample[i].output) {
                                    ceFound = true;
                                    break;
                                }
                            }
                            if (ceFound) {
                                deferred.resolve(ce);
                            } else {
                                deferred.reject();
                            }
                        })
                }

                return deferred.promise;
            }
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
        return {
            scope: {
                learnConfiguration: '='
            },
            templateUrl: paths.COMPONENTS + '/core/views/directives/learn-resume-settings-widget.html',
            link: link
        };

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