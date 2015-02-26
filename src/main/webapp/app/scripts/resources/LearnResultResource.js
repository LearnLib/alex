(function () {
    'use strict';

    angular
        .module('weblearner.resources')
        .factory('LearnResultResource', [
            '$http', '$q', 'paths', 'ResourceResponseService',
            LearnResultResource
        ]);

    /**
     * LearnResultResource
     * 
     * The resource the get test results from the server
     *
     * @param $http
     * @param $q
     * @param paths
     * @param ResourceResponseService
     * @return {{getGetAllFinal: getGetAllFinal, getFinal: getFinal, getComplete: getComplete, delete: deleteTest}}
     * @constructor
     */
    function LearnResultResource($http, $q, paths, ResourceResponseService) {

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
            return $http.get(paths.api.URL + '/projects/' + projectId + '/results')
                .then(ResourceResponseService.success)
                .catch(ResourceResponseService.fail);
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
                .then(ResourceResponseService.success)
                .catch(ResourceResponseService.fail);
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
                .then(ResourceResponseService.success)
                .catch(ResourceResponseService.fail);
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
        	
            return $http.delete(paths.api.URL + '/projects/' + projectId + '/results/' + testNo, {})
                .then(success)
                .catch(ResourceResponseService.fail);

            function success(response) {
                var message = 'The results were deleted';
                return ResourceResponseService.successWithToast(response, message);
            }
        }
    }
}());