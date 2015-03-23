(function () {
    'use strict';

    angular
        .module('weblearner.services')
        .factory('CounterExampleService', CounterExampleService);

    CounterExampleService.$inject = [];

    function CounterExampleService() {

        var counterexample = [];

        return {
            getCurrentCounterexample: getCurrentCounterexample,
            setCurrentCounterexample: setCurrentCounterexample,
            resetCurrentCounterexample: resetCurrentCounterexample,
            addIOPairToCurrentCounterexample: addIOPairToCurrentCounterexample
        };

        function getCurrentCounterexample() {
            return counterexample;
        }

        function setCurrentCounterexample(ce) {
            counterexample = ce;
        }

        function resetCurrentCounterexample() {
            counterexample = [];
        }

        function addIOPairToCurrentCounterexample(input, output) {
            counterexample.push({
                input: input,
                output: output
            })
        }
    }
}());