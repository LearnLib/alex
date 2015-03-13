(function () {
    'use strict';

    angular
        .module('weblearner.resources')
        .factory('LearnerResource', [
            '$http', '$q', 'paths', 'ResourceResponseService',
            Learner
        ]);

    /**
     * Learner
     * The resource that is used to communicate with the learner
     *
     * @param $http
     * @param $q
     * @param paths
     * @param ResourceResponseService
     * @return {{start: startLearning, stop: stopLearning, resume: resumeLearning, status: getStatus, isActive: isActive}}
     * @constructor
     */
    function Learner($http, $q, paths, ResourceResponseService) {

        var service = {
            start: startLearning,
            stop: stopLearning,
            resume: resumeLearning,
            status: getStatus,
            isActive: isActive
        };
        return service;

        /**
         * Start the server side learning process of a project
         *
         * @param projectId
         * @param learnConfiguration
         * @return {*}
         */
        function startLearning(projectId, learnConfiguration) {
            return $http.post(paths.api.URL + '/learner/start/' + projectId, learnConfiguration)
                .then(ResourceResponseService.success)
                .catch(ResourceResponseService.fail);
        }

        /**
         * Try to force stop a running learning process of a project. May not necessarily work due to difficulties
         * with the thread handling
         *
         * @return {*}
         */
        function stopLearning() {
            return $http.get(paths.api.URL + '/learner/stop/')
                .then(ResourceResponseService.success)
                .catch(ResourceResponseService.fail);
        }

        /**
         * Resume a paused learning process where the eqOracle was 'sample' and the learn process was interrupted
         * so that the ongoing process parameters could be defined
         *
         * @param projectId
         * @param learnConfiguration
         * @return {*}
         */
        function resumeLearning(projectId, testNo, learnConfiguration) {
            return $http.post(paths.api.URL + '/learner/resume/' + projectId + '/' + testNo, learnConfiguration)
                .then(ResourceResponseService.success)
                .catch(ResourceResponseService.fail);
        }

        /**
         * Gets the learner result that includes the hypothesis. make sure isActive() returns true before calling this
         * function
         *
         * @return {*}
         */
        function getStatus() {
            return $http.get(paths.api.URL + '/learner/status/')
                .then(ResourceResponseService.success)
                .catch(ResourceResponseService.fail);
        }

        /**
         * Check if the server is finished learning a project
         *
         * @return {*}
         */
        function isActive() {
            return $http.get(paths.api.URL + '/learner/active')
                .then(ResourceResponseService.success)
                .catch(ResourceResponseService.fail);
        }
    }
}());