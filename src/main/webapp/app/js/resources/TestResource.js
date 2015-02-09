(function () {
    'use strict';

    angular
        .module('weblearner.resources')
        .factory('TestResource', [
            '$http', '$q', 'api', 'ngToast',
            Test
        ]);

    /**
     * Test
     * The resource the get test results from the server
     *
     * @param $http
     * @param $q
     * @param api
     * @param toast
     * @return {{getGetAllFinal: getGetAllFinal, getFinal: getFinal, getComplete: getComplete, delete: deleteTest}}
     * @constructor
     */
    function Test($http, $q, api, toast) {

        // the service
        var service = {
            getAllFinal: getAllFinal,
            getFinal: getFinal,
            getComplete: getComplete,
            delete: deleteTests
        };
        return service;

        //////////

        /**
         * Get all final results from all tests that were run for a project. the results only include the final
         * hypothesis
         *
         * @param projectId
         * @return {*}
         */
        function getAllFinal(projectId) {
            return $http.get(api.URL + '/projects/' + projectId + '/results')
                .then(success)
                .catch(fail);

            function success(response) {
                return response.data;
            }

            function fail(error) {
                console.error(error.data);
                toast.create({
                    class: 'danger',
                    content: error.data.message,
                    dismissButton: true
                });
                return $q.reject();
            }
        }

        /**
         * Get the final test result for a project that only includes the final hypothesis
         *
         * @param projectId
         * @param testNo
         * @return {*}
         */
        function getFinal(projectId, testNo) {
            return $http.get(api.URL + '/projects/' + projectId + '/results/' + testNo)
                .then(success)
                .catch(fail);

            function success(response) {
                return response.data;
            }

            function fail(error) {
                console.error(error.data);
                toast.create({
                    class: 'danger',
                    content: error.data.message,
                    dismissButton: true
                });
                return $q.reject();
            }
        }

        /**
         * Get all created hypotheses that were created during a learn process of a project
         *
         * @param projectId
         * @param testNo
         * @return {*}
         */
        function getComplete(projectId, testNo) {

            return $http.get(api.URL + '/projects/' + projectId + '/results/' + testNo + '/complete')
                .then(success)
                .catch(fail);

            function success(response) {
                return response.data;
            }

            function fail(error) {
                console.error(error.data);
                toast.create({
                    class: 'danger',
                    content: error.data.message,
                    dismissButton: true
                });
                return $q.reject();
            }
        }

        /**
         * Delete a complete test run, that also includes all hypotheses that were created
         *
         * @param projectId
         * @param testNo
         * @return {*}
         */
        function deleteTests(projectId, testNo) {
        	
        	if (angular.isArray(testNo)) {
        		testNo = testNo.join();
        	}
        	
            return $http.delete(api.URL + '/projects/' + projectId + '/results/' + testNo, {})
                .then(success)
                .catch(fail);

            function success(response) {
            	toast.create({
                    class: 'success',
                    content: 'The results were deleted.',
                    dismissButton: true
                });
                return response.data;
            }

            function fail(error) {
            	console.log('=============');
                console.error(error.data);
                toast.create({
                    class: 'danger',
                    content: error.data.message,
                    dismissButton: true
                });
                return $q.reject();
            }
        }
    }
}());