(function () {
    'use strict';

    angular
        .module('ALEX.services')
        .factory('CounterExampleService', CounterExampleService);

    /**
     * The service that is used to share a counterexample between the counter example widget and a hypothesis.
     * A counterexample is defined by a list of objects with input & output property
     *
     * @returns {{getCurrentCounterexample: getCurrentCounterexample, setCurrentCounterexample: setCurrentCounterexample, resetCurrentCounterexample: resetCurrentCounterexample, addIOPairToCurrentCounterexample: addIOPairToCurrentCounterexample}}
     * @constructor
     */
    function CounterExampleService() {
        var counterexample = [];

        return {
            getCurrentCounterexample: getCurrentCounterexample,
            setCurrentCounterexample: setCurrentCounterexample,
            resetCurrentCounterexample: resetCurrentCounterexample,
            addIOPairToCurrentCounterexample: addIOPairToCurrentCounterexample
        };

        /**
         * Gets the counterexample
         *
         * @returns {Object[]} - The counterexample
         */
        function getCurrentCounterexample() {
            return counterexample;
        }

        /**
         * Sets the counterexample
         *
         * @param {Object[]} ce - The list of input/output pairs that define a counterexample
         */
        function setCurrentCounterexample(ce) {
            counterexample = ce;
        }

        /**
         * Removes all input / output pairs from the counterexample
         */
        function resetCurrentCounterexample() {
            counterexample = [];
        }

        /**
         * Adds a new input / output pair to the counterexample
         *
         * @param {string} input - The input symbol
         * @param {string} output - The output symbol
         */
        function addIOPairToCurrentCounterexample(input, output) {
            counterexample.push({
                input: input,
                output: output
            })
        }
    }
}());