(function () {
    'use strict';

    angular
        .module('ALEX.services')
        .factory('LearnerService', LearnerService);

    LearnerService.$inject = ['$http', 'paths'];

    /**
     * The service for interacting with the learner
     *
     * @param $http - angular $http service
     * @param paths - The applications paths constant
     * @returns {{start: start, stop: stop, resume: resume, getStatus: getStatus, isActive: isActive, isCounterexample: isCounterexample}}
     * @constructor
     */
    function LearnerService($http, paths) {
        return {
            start: start,
            stop: stop,
            resume: resume,
            getStatus: getStatus,
            isActive: isActive,
            isCounterexample: isCounterexample
        };

        /**
         * Start the server side learning process of a project
         *
         * @param projectId
         * @param learnConfiguration
         * @return {*}
         */
        function start(projectId, learnConfiguration) {
            return $http.post(paths.api.URL + '/learner/start/' + projectId, learnConfiguration);
        }

        /**
         * Try to force stop a running learning process of a project. May not necessarily work due to difficulties
         * with the thread handling
         *
         * @return {*}
         */
        function stop() {
            return $http.get(paths.api.URL + '/learner/stop/');
        }

        /**
         * Resume a paused learning process where the eqOracle was 'sample' and the learn process was interrupted
         * so that the ongoing process parameters could be defined
         *
         * @param projectId
         * @param testNo
         * @param learnConfiguration
         * @return {*}
         */
        function resume(projectId, testNo, learnConfiguration) {
            return $http.post(paths.api.URL + '/learner/resume/' + projectId + '/' + testNo, learnConfiguration);
        }

        /**
         * Gets the learner result that includes the hypothesis. make sure isActive() returns true before calling this
         * function
         *
         * @return {*}
         */
        function getStatus() {
            return $http.get(paths.api.URL + '/learner/status/')
                .then(function (response) {
                    return response.data;
                })
        }

        /**
         * Check if the server is finished learning a project
         *
         * @return {*}
         */
        function isActive() {
            return $http.get(paths.api.URL + '/learner/active')
                .then(function (response) {
                    return response.data;
                })
        }

        /**
         * Checks if the selected path is a counterexample.
         * TODO: implement as soon as the api has an interface for that
         *
         * @param {number} projectId
         * @param {{input: string, output: string}[]} counterexample
         * @returns {*}
         */
        function isCounterexample(projectId, counterexample) {
            return $http.post(paths.api.URL + '/learner/active', {})
                .then(function () {
                    return true;
                })
        }
    }
}());