(function () {
    'use strict';

    angular
        .module('ALEX.resources')
        .factory('LearnResultResource', Resource);

    Resource.$inject = ['$http', 'paths'];

    /**
     * The resource that handles http request to the API to do CRUD operations on learn results
     *
     * @param $http - The angular http service
     * @param paths - The constant with application paths
     * @returns {LearnResultResource} - The LearnResource class
     * @constructor
     */
    function Resource($http, paths) {

        /**
         * The LearnResultResource
         * @constructor
         */
        function LearnResultResource() {
        }

        /**
         * Makes a GET request to 'rest/projects/{projectId}/results in order to get all final learn results of all
         * tests of a project.
         *
         * @param {number} projectId - The id of the project whose final learn results should be fetched
         * @returns {*} - A promise with the learn results
         */
        LearnResultResource.prototype.getAllFinal = function (projectId) {
            var _this = this;

            return $http.get(paths.api.URL + '/projects/' + projectId + '/results')
                .then(function (response) {
                    return _this.buildSome(response.data);
                })
        };

        /**
         * Makes a GET request to 'rest/projects/{projectId}/results/{testNo}' in order to get the final cumulated
         * learn result from a test
         *
         * @param {number} projectId - The id of the project
         * @param {number} testNo - The number of the test run
         * @returns {*} - A promise
         */
        LearnResultResource.prototype.getFinal = function (projectId, testNo) {
            var _this = this;

            return $http.get(paths.api.URL + '/projects/' + projectId + '/results/' + testNo)
                .then(function (response) {
                    return _this.build(response.data);
                })
        };

        /**
         * Makes a GET request to 'rest/projects/{projectId}/results/{testNo}/complete in order to get all intermediate
         * results of a test.
         *
         * @param {number} projectId - The id of the project of the test
         * @param {number} testNo - The number of the test that should be completely fetched
         * @returns {*} - A promise with a list of learn results
         */
        LearnResultResource.prototype.getComplete = function (projectId, testNo) {
            var _this = this;

            return $http.get(paths.api.URL + '/projects/' + projectId + '/results/' + testNo + '/complete')
                .then(function (response) {
                    response.data.shift();
                    return _this.buildSome(response.data);
                })
        };

        /**
         * Fetches multiple complete test results.
         *
         * @param {number} projectId - The id of the project
         * @param {number[]} testNos - The numbers of the tests
         * @returns {*}
         */
        LearnResultResource.prototype.getSomeComplete = function (projectId, testNos) {
            var numbers = testNos.join(',');

            return $http.get(paths.api.URL + '/projects/' + projectId + '/results/' + numbers + '/complete')
                .then(function (response) {
                    var data = response.data;
                    if (data.length > 0) {
                        if (!angular.isArray(data[0])) {
                            data.shift();
                            return [data]
                        } else {

                            // remove cumulated results from the beginning
                            for(var i = 0; i < data.length; i++) {
                                data[i].shift();
                            }
                            return data;
                        }
                    } else {
                        return [[]];
                    }
                })
        };

        /**
         * Wrapper for deleteSome for a single testNo
         *
         * @param {number} projectId
         * @param {number} testNo
         */
        LearnResultResource.prototype.delete = function (projectId, testNo) {
            this.deleteSome(projectId, [testNo]);
        };

        /**
         * Makes a DELETE request to '/rest/projects/{projectId}/results/{testNos} in order to delete test results.
         *
         * @param {number} projectId - The id of the tests that should be deleted
         * @param {number[]} testNos - The array of test numbers of the tests that should be deleted
         * @returns {*} - A promise
         */
        LearnResultResource.prototype.deleteSome = function (projectId, testNos) {
            var numbers = testNos.join(',');

            return $http.delete(paths.api.URL + '/projects/' + projectId + '/results/' + numbers, {})
        };

        /**
         * Overwrite this method in order to map the data that is fetched from the server to a class. The function is
         * called after every successful request that contains data.
         *
         * @param {Object} data - The object that should be created an instance of a class from
         * @returns {*}
         */
        LearnResultResource.prototype.build = function (data) {
            return data;
        };

        /**
         * Overwrite this method in order to map the a list of objects that is fetched from the server to a list of
         * class instances. The function is called after every successful request that contains data.
         *
         * @param {Object[]} data - The list of objects that should be created a list of instances of a class from
         * @returns {*}
         */
        LearnResultResource.prototype.buildSome = function (data) {
            return data;
        };

        return LearnResultResource;
    }
}());