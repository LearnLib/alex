(function () {
    'use strict';

    angular
        .module('weblearner.directives')
        .directive('learnResultsPanel', learnResultsPanel);

    learnResultsPanel.$inject = ['paths'];

    function learnResultsPanel(paths) {
        return {
            scope: {
                results: '=',
                counterExample: '='
            },
            templateUrl: paths.views.DIRECTIVES + '/learn-results-panel.html',
            controller: ['$scope', controller]
        };

        function controller($scope) {

            $scope.modes = {
                HYPOTHESIS: 0,
                INTERNAL: 1
            };

            /**
             * The layout settings for the displayed hypothesis
             * @type {undefined|Object}
             */
            $scope.layoutSettings;

            $scope.mode = $scope.modes.HYPOTHESIS;

            $scope.pointer = $scope.results.length - 1;

            $scope.firstStep = function () {
                scope.pointer = 0;
            };

            $scope.previousStep = function () {
                if ($scope.pointer - 1 < 0) {
                    $scope.lastStep();
                } else {
                    $scope.pointer--;
                }
            };

            $scope.nextStep = function () {
                if ($scope.pointer + 1 > $scope.results.length - 1) {
                    $scope.firstStep();
                } else {
                    $scope.pointer++;
                }
            };

            $scope.lastStep = function () {
                $scope.pointer = $scope.results.length - 1;
            };

            $scope.getCurrentStep = function () {
                return $scope.results[$scope.pointer];
            };

            $scope.hasInternalDataStructure = function () {
                return angular.isDefined($scope.results[$scope.pointer].algorithmInformation);
            };

            $scope.showInternalDataStructure = function () {
                $scope.mode = $scope.modes.INTERNAL;
            };

            $scope.showHypothesis = function () {
                $scope.mode = $scope.modes.HYPOTHESIS;
            }
        }
    }
}());