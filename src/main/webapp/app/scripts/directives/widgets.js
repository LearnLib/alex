(function () {
    'use strict';

    angular
        .module('weblearner.directives')
        .directive('widget', widget)
        .directive('counterexamplesWidget', counterexamplesWidget)
        .directive('learnResumeSettingsWidget', learnResumeSettingsWidget);

    widget.$inject = ['paths'];
    counterexamplesWidget.$inject = ['paths', 'CounterExampleService', 'LearnerService', 'ToastService', '_', 'outputAlphabet'];
    learnResumeSettingsWidget.$inject = ['paths', 'eqOracles', 'EqOracle'];


    /**
     * The directive for displaying a collapsable widget without content. Use is a a wrapper for any content you like.
     *
     * Attribute 'collapsed' {boolean} can be applied to tell whether the widgets content should be displayed or not.
     * Attribute 'widgetTitle' {string} can be applied for displaying a widget title.
     *
     * Use: '<widget widget-title="..." collapsed="..."></widget>'
     *
     * @param paths - The applications constant for paths
     * @returns {{scope: {collapsed: string, widgetTitle: string}, templateUrl: string, transclude: boolean, link: link}}
     */
    function widget(paths) {

        // the directive
        return {
            scope: {
                collapsed: '=',
                widgetTitle: '@'
            },
            templateUrl: paths.views.DIRECTIVES + '/widget.html',
            transclude: true,
            link: link
        };

        // the directives behavior
        function link(scope, el, attrs) {

            /**
             * The title that should be displayed in the widget header
             * @type {string}
             */
            scope.title = scope.widgetTitle || 'Untitled';

            /**
             * Flag for the display of the widget content
             * @type {boolean}
             */
            scope.collapsed = scope.collapsed || false;

            /**
             * Collapses or uncollapses the widget content
             */
            scope.toggleCollapse = function () {
                scope.collapsed = !scope.collapsed;
            }
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
     * @param Learner - The LearnerServive for communication with the Learner
     * @param Toast - The ToastService
     * @param _ - Lodash
     * @param outputAlphabet - The dictionary for the output alphabet
     * @returns {{scope: {counterexamples: string}, templateUrl: string, link: link}}
     */
    function counterexamplesWidget(paths, CounterExampleService, Learner, Toast, _, outputAlphabet) {

        // the directive
        return {
            scope: {
                counterexamples: '='
            },
            templateUrl: paths.views.DIRECTIVES + '/counterexamples-widget.html',
            link: link
        };

        // the directives behavior
        function link(scope, el, attrs) {

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
             * Tests if the entered couterexample really is one by sending it to the server for testing purposes.
             */
            scope.testCounterExample = function () {
                Learner.isCounterexample(scope.counterExample)
                    .then(function (isCounterexample) {
                        if (isCounterexample) {
                            Toast.success('The selected word is a counterexample');
                        } else {
                            Toast.danger('The selected word is not a counterexample');
                        }
                    })
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
     * @param eqOracles
     * @param EqOracle
     * @returns {{scope: {learnConfiguration: string}, templateUrl: string, link: link}}
     */
    function learnResumeSettingsWidget(paths, eqOracles, EqOracle) {

        // the directive
        return {
            scope: {
                learnConfiguration: '='
            },
            templateUrl: paths.views.DIRECTIVES + '/learn-resume-settings-widget.html',
            link: link
        };

        // the directives behavior
        function link(scope, el, attrs) {

            /**
             * The dictionary for eq oracle types
             * @type {Object}
             */
            scope.eqOracles = eqOracles;

            /**
             * The selected eq oracle type from the select box
             * @type {string}
             */
            scope.selectedEqOracle = scope.learnConfiguration.eqOracle.type;

            /**
             * Creates a new eq oracle object from the selected type and assigns it to the configuration
             */
            scope.setEqOracle = function () {
                scope.learnConfiguration.eqOracle = EqOracle.createFromType(scope.selectedEqOracle);
            };
        }
    }
}());