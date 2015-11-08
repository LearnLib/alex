(function () {
    'use strict';

    angular
        .module('ALEX.resources')
        .factory('LearnResultResource', Resource);

    /**
     * The resource that handles http request to the API to do CRUD operations on learn results
     *
     * @param $http - The angular http service
     * @param paths - The constant with application paths
     * @param LearnResult - The factory for LearnResult objects
     * @param _ - Lodash
     * @returns {{getFinal: getFinal, getAllFinal: getAllFinal, getComplete: getComplete, delete: remove}}
     * @constructor
     */
    // @ngInject
    function Resource($http, paths, LearnResult, _) {
        return {
            getFinal: getFinal,
            getAllFinal: getAllFinal,
            getComplete: getComplete,
            delete: remove
        };

        /**
         * Makes a GET request to 'rest/projects/{projectId}/results in order to get all final learn results of all
         * tests of a project.
         *
         * @param {number} projectId - The id of the project whose final learn results should be fetched
         * @returns {*} - A promise with the learn results
         */
        function getAllFinal(projectId) {
            return $http.get(paths.api.URL + '/projects/' + projectId + '/results')
                .then(LearnResult.transformApiResponse);
        }

        /**
         * Makes a GET request to 'rest/projects/{projectId}/results/{testNo}' in order to get the final cumulated
         * learn result from a test
         *
         * @param {number} projectId - The id of the project
         * @param {number} testNo - The number of the test run
         * @returns {*} - A promise
         */
        function getFinal(projectId, testNo) {
            return $http.get(paths.api.URL + '/projects/' + projectId + '/results/' + testNo)
                .then(LearnResult.transformApiResponse);
        }

        /**
         * Makes a GET request to 'rest/projects/{projectId}/results/{testNos}/complete in order to get all intermediate
         * results of a test.
         *
         * @param {number} projectId - The id of the project of the test
         * @param {number, number[]} testNos - The number[s] of the test[s] that should be completely fetched
         * @returns {*} - A promise with a list of learn results
         */
        function getComplete(projectId, testNos) {
            if (angular.isArray(testNos)) {
                return $http.get(paths.api.URL + '/projects/' + projectId + '/results/' + testNos.join(',') + '/complete')
                    .then(function (response) {
                        if (response.data.length > 0) {
                            if (!angular.isArray(response.data[0])) {
                                response.data.shift();
                                return [LearnResult.transformApiResponse(response)]
                            } else {
                                _.forEach(response.data, function (data) {
                                    data.shift(); // remove cumulated results from the beginning
                                });
                                return LearnResult.transformApiResponse(response);
                            }
                        } else {
                            return [[]];
                        }
                    })
            } else {
                return $http.get(paths.api.URL + '/projects/' + projectId + '/results/' + testNos + '/complete')
                    .then(function (response) {
                        response.data.shift();
                        return LearnResult.transformApiResponse(response);
                    })
            }
        }


        /**
         * Makes a DELETE request to /rest/{projectId}/results/{testNos} in order to delete learning results
         *
         * @param {LearnResult|LearnResult[]} results
         */
        function remove(results) {
            var testNos, projectId;
            if (angular.isArray(results)) {
                testNos = _.pluck(results, 'testNo').join(',');
                projectId = results[0].project;
            } else {
                testNos = results.testNo;
                projectId = results.project;
            }
            return $http.delete(paths.api.URL + '/projects/' + projectId + '/results/' + testNos, {})
        }
    }
}());