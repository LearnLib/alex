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
        $scope.tests = [];
        $scope.panels = [];

        //////////

        TestResource.getAllFinal($scope.project.id)
            .then(function (tests) {
                $scope.tests = tests;
                return $stateParams.testNo;
            })
            .then(loadIntermediateResults);

        //////////

        function loadIntermediateResults(testNo, index) {
            TestResource.getComplete($scope.project.id, testNo)
                .then(function (steps) {
                    if (!index) {
                        $scope.panels.push({
                            testNo: testNo,
                            steps: steps,
                            pointer: steps.length - 1
                        })
                    } else {
                        $scope.panels[index] = {
                            testNo: testNo,
                            steps: steps,
                            pointer: steps.length - 1
                        }
                    }
                })
        }

        //////////

        $scope.getPanelStyle = function (index) {

            var width = 100 / $scope.panels.length;
            var style = 'width: ' + width + '%; ' +
                'top: 50px; bottom: 0; background: #fff; border-right: 1px solid #e7e7e7; position: absolute;' +
                'left: ' + (index * width) + '%';

            return style;
        };

        $scope.closePanel = function (index) {
            $scope.panels.splice(index, 1);
        };

        $scope.addEmptyPanel = function () {
            $scope.panels.push({})
        };

        $scope.addPanel = function (test, index) {
            loadIntermediateResults(test.testNo, index);
        };

        $scope.clearPanel = function (index) {
            $scope.panels[index] = {}
        }
    }

}());