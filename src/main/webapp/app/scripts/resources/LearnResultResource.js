(function () {
    'use strict';

    angular
        .module('weblearner.resources')
        .factory('LearnResultResource', LearnResultResource);

    LearnResultResource.$inject = ['$http', 'paths'];

    /**
     * @param $http
     * @param paths
     * @returns {{getAllFinal: getAllFinal, getFinal: getFinal, getComplete: getComplete, delete: deleteTests}}
     * @constructor
     */
    function LearnResultResource($http, paths) {

        // the service
        var service = {
            getAllFinal: getAllFinal,
            getFinal: getFinal,
            getComplete: getComplete,
            delete: deleteTests
        };
        return service;

        /**
         * Get all final results from all tests that were run for a project. the results only include the final
         * hypothesis
         *
         * @param projectId
         * @return {*}
         */
        function getAllFinal(projectId) {
            return $http.get(paths.api.URL + '/projects/' + projectId + '/results')
                .then(function (response) {
                    return response.data;
                })
        }

        /**
         * Get the final test result for a project that only includes the final hypothesis
         *
         * @param projectId
         * @param testNo
         * @return {*}
         */
        function getFinal(projectId, testNo) {
            return $http.get(paths.api.URL + '/projects/' + projectId + '/results/' + testNo)
                .then(function (response) {
                    return response.data;
                })
        }

        /**
         * Get all created hypotheses that were created during a learn process of a project
         *
         * @param projectId
         * @param testNo
         * @return {*}
         */
        function getComplete(projectId, testNo) {

            return $http.get(paths.api.URL + '/projects/' + projectId + '/results/' + testNo + '/complete')
                .then(function (response) {
                    return response.data;
                })
        }

        /**
         *
         * @param projectId
         * @param testNos
         * @returns {HttpPromise}
         */
        function deleteTests(projectId, testNos) {

            if (angular.isArray(testNos)) {
                testNos = testNos.join(',');
            }

            return $http.delete(paths.api.URL + '/projects/' + projectId + '/results/' + testNos, {})
        }
    }
}());