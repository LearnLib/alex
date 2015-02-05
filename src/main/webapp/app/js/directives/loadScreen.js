(function () {
    'use strict';

    angular
        .module('weblearner.directives')
        .directive('loadScreen', loadScreen);

    function loadScreen() {

        var directive = {
            scope: {},
            templateUrl: 'app/partials/directives/load-screen.html',
            controller: [
                '$scope',
                controller
            ]
        };
        return directive;

        //////////

        function controller($scope) {

            $scope.counter = 0;

            //////////

            $scope.$on('loadScreen.show', show);
            $scope.$on('loadScreen.hide', hide);

            //////////

            function show() {
                $scope.counter++;
            }

            function hide() {
                $scope.counter--;
                if ($scope.counter < 0) {
                    $scope.counter = 0;
                }
            }
        }
    }
}());