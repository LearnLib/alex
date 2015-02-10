(function () {
    'use strict';

    angular
        .module('weblearner.controller')
        .controller('LearnResultsCompareController', [
            '$scope', '$stateParams', 'SessionService', 'TestResource',
            LearnResultsCompareController
        ]);

    function LearnResultsCompareController($scope, $stateParams, SessionService, TestResource) {

        $scope.project = SessionService.project.get();
        $scope.finalTestResults = [];
        $scope.panels = [];
        $scope.layoutSettings = [];

        //////////

        TestResource.getAllFinal($scope.project.id)
            .then(function (finalTestResults) {
                $scope.finalTestResults = finalTestResults;
                return $stateParams.testNos;
            })
            .then(loadComplete);

        //////////

        function loadComplete(testNos, index) {
        	
        	testNos = testNos.split(',');
        	_.forEach(testNos, function(testNo){       		
        		TestResource.getComplete($scope.project.id, testNo)
                .then(function(completeTestResult){
                    if (angular.isUndefined(index)) {
                        $scope.panels.push(completeTestResult);
                    } else {
                        $scope.panels[index] = completeTestResult;
                    }
                })
        	})
        }

        //////////

        $scope.fillPanel = function (result, index) {
            loadComplete(result.testNo, index);
        }
    }

}());