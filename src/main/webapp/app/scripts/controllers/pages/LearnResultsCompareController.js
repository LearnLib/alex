(function () {
    'use strict';

    angular
        .module('weblearner.controller')
        .controller('LearnResultsCompareController', [
            '$scope', '$stateParams', 'SessionService', 'LearnResultResource',
            LearnResultsCompareController
        ]);

    function LearnResultsCompareController($scope, $stateParams, SessionService, LearnResultResource) {

        $scope.project = SessionService.project.get();
        $scope.results = [];
        $scope.panels = [];
        $scope.layoutSettings = [];

        //////////

        LearnResultResource.getAllFinal($scope.project.id)
            .then(function (results) {
                $scope.results = results;
                return $stateParams.testNos;
            })
            .then(loadComplete);

        //////////

        function loadComplete(testNos, index) {
        	testNos = testNos.split(',');
        	_.forEach(testNos, function(testNo){       		
        		LearnResultResource.getComplete($scope.project.id, testNo)
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
            loadComplete(result.testNo + '', index);
        }
    }

}());