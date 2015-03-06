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
                .then(function(){
                    return [{
                        "amountOfResets": 111,
                        "configuration": {
                            "algorithm": "EXTENSIBLE_LSTAR",
                            "eqOracle": {
                                "type": "sample",
                                "counterExamples": [{"input": ["w2", "w2", "w3"], "output": ["OK", "OK", "OK"]}]
                            },
                            "maxAmountOfStepsToLearn": 0,
                            "symbols": [{"id": 1, "revision": 2}, {"id": 3, "revision": 2}, {
                                "id": 4,
                                "revision": 2
                            }, {"id": 5, "revision": 2}, {"id": 6, "revision": 2}]
                        },
                        "duration": 40759,
                        "hypothesis": {
                            "nodes": [0, 1, 2],
                            "initNode": 0,
                            "edges": [{"from": 0, "input": "reset", "to": 0, "output": "OK"}, {
                                "from": 0,
                                "input": "w1",
                                "to": 0,
                                "output": "OK"
                            }, {"from": 0, "input": "w2", "to": 2, "output": "OK"}, {
                                "from": 0,
                                "input": "w3",
                                "to": 0,
                                "output": "FAILED"
                            }, {"from": 0, "input": "w4", "to": 0, "output": "OK"}, {
                                "from": 1,
                                "input": "reset",
                                "to": 0,
                                "output": "OK"
                            }, {"from": 1, "input": "w1", "to": 1, "output": "OK"}, {
                                "from": 1,
                                "input": "w2",
                                "to": 0,
                                "output": "OK"
                            }, {"from": 1, "input": "w3", "to": 2, "output": "OK"}, {
                                "from": 1,
                                "input": "w4",
                                "to": 1,
                                "output": "FAILED"
                            }, {"from": 2, "input": "reset", "to": 0, "output": "OK"}, {
                                "from": 2,
                                "input": "w1",
                                "to": 2,
                                "output": "OK"
                            }, {"from": 2, "input": "w2", "to": 1, "output": "OK"}, {
                                "from": 2,
                                "input": "w3",
                                "to": 2,
                                "output": "FAILED"
                            }, {"from": 2, "input": "w4", "to": 2, "output": "OK"}]
                        },
                        "project": 1,
                        "sigma": ["reset", "w1", "w2", "w3", "w4"],
                        "startTime": "2015-03-05T09:19:02.250+00:00",
                        "stepNo": 2,
                        "testNo": 1,
                        "type": "web"
                    }, {
                        "amountOfResets": 41,
                        "configuration": {
                            "algorithm": "DISCRIMINATION_TREE",
                            "eqOracle": {
                                "type": "sample",
                                "counterExamples": [{"input": ["w2", "w2", "w3"], "output": ["OK", "OK", "OK"]}]
                            },
                            "maxAmountOfStepsToLearn": 0,
                            "symbols": [{"id": 1, "revision": 2}, {"id": 3, "revision": 2}, {
                                "id": 4,
                                "revision": 2
                            }, {"id": 5, "revision": 2}, {"id": 6, "revision": 2}]
                        },
                        "duration": 26402,
                        "hypothesis": {
                            "nodes": [0, 2, 1],
                            "initNode": 0,
                            "edges": [{"from": 0, "input": "reset", "to": 0, "output": "OK"}, {
                                "from": 0,
                                "input": "w1",
                                "to": 0,
                                "output": "OK"
                            }, {"from": 0, "input": "w2", "to": 1, "output": "OK"}, {
                                "from": 0,
                                "input": "w3",
                                "to": 0,
                                "output": "FAILED"
                            }, {"from": 0, "input": "w4", "to": 0, "output": "OK"}, {
                                "from": 1,
                                "input": "reset",
                                "to": 0,
                                "output": "OK"
                            }, {"from": 1, "input": "w1", "to": 1, "output": "OK"}, {
                                "from": 1,
                                "input": "w2",
                                "to": 2,
                                "output": "OK"
                            }, {"from": 1, "input": "w3", "to": 1, "output": "FAILED"}, {
                                "from": 1,
                                "input": "w4",
                                "to": 1,
                                "output": "OK"
                            }, {"from": 2, "input": "reset", "to": 0, "output": "OK"}, {
                                "from": 2,
                                "input": "w1",
                                "to": 2,
                                "output": "OK"
                            }, {"from": 2, "input": "w2", "to": 0, "output": "OK"}, {
                                "from": 2,
                                "input": "w3",
                                "to": 1,
                                "output": "OK"
                            }, {"from": 2, "input": "w4", "to": 2, "output": "FAILED"}]
                        },
                        "project": 1,
                        "sigma": ["reset", "w1", "w2", "w3", "w4"],
                        "startTime": "2015-03-05T09:21:02.962+00:00",
                        "stepNo": 2,
                        "testNo": 2,
                        "type": "web"
                    }, {
                        "amountOfResets": 20,
                        "configuration": {
                            "algorithm": "DHC",
                            "eqOracle": {"type": "random_word", "minLength": 1, "maxLength": 2, "maxNoOfTests": 1},
                            "maxAmountOfStepsToLearn": 0,
                            "symbols": [{"id": 1, "revision": 2}, {"id": 3, "revision": 2}, {
                                "id": 4,
                                "revision": 2
                            }, {"id": 5, "revision": 2}]
                        },
                        "duration": 9208,
                        "hypothesis": {
                            "nodes": [0],
                            "initNode": 0,
                            "edges": [{"from": 0, "input": "reset", "to": 0, "output": "OK"}, {
                                "from": 0,
                                "input": "w1",
                                "to": 0,
                                "output": "OK"
                            }, {"from": 0, "input": "w2", "to": 0, "output": "OK"}, {
                                "from": 0,
                                "input": "w3",
                                "to": 0,
                                "output": "FAILED"
                            }]
                        },
                        "project": 1,
                        "sigma": ["reset", "w1", "w2", "w3"],
                        "startTime": "2015-03-05T12:29:19.995+00:00",
                        "stepNo": 1,
                        "testNo": 3,
                        "type": "web"
                    }];
                })
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