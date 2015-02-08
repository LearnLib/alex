(function () {
    'use strict';

    angular
        .module('weblearner.controller')
        .controller('HypothesesSlideshowController', [
            '$scope', '$stateParams', 'SessionService', 'TestResource',
            HypothesesSlideshowController
        ]);

    function HypothesesSlideshowController($scope, $stateParams, SessionService, TestResource) {

        $scope.project = SessionService.project.get();
        $scope.finalTestResults = [];
        $scope.panels = [];

        //////////

        TestResource.getAllFinal($scope.project.id)
            .then(function (finalTestResults) {
                $scope.finalTestResults = finalTestResults;
                return $stateParams.testNo;
            })
            .then(loadComplete);

        //////////

        function loadComplete(testNo, index) {
            TestResource.getComplete($scope.project.id, testNo)
                .then(function(completeTestResult){
                    if (angular.isUndefined(index)) {
                        $scope.panels[0] = completeTestResult;
                    } else {
                        $scope.panels[index] = completeTestResult;
                    }
                })
        }

        //////////

        $scope.fillPanel = function (result, index) {
            loadComplete(result.testNo, index);
        }
    }

}());