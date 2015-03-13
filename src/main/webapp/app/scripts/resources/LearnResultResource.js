(function () {
    'use strict';

    angular
        .module('weblearner.resources')
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
                    return _this.buildSome(response.data);
                })
        };

        // TODO: implement when api has implemented the function
        // LearnResultResource.prototype.getSomeComplete = function (projectId, testNos) {}

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
            testNos = testNos.join(',');

            return $http.delete(paths.api.URL + '/projects/' + projectId + '/results/' + testNos, {})
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