(function () {
    'use strict';

    angular
        .module('weblearner.directives')
        .directive('indexBrowser', indexBrowser);

    indexBrowser.$inject = ['paths'];

    function indexBrowser(paths) {

        return {
            templateUrl: paths.views.DIRECTIVES + '/index-browser.html',
            scope: {
                length: '@',
                index: '='
            },
            link: link
        };

        function link(scope, el, attrs) {

            var length = parseInt(scope.length);

            scope.firstStep = function () {
                scope.index = 0;
            };

            scope.previousStep = function () {
                if (scope.index - 1 < 0) {
                    scope.lastStep();
                } else {
                    scope.index--;
                }
            };

            scope.nextStep = function () {
                if (scope.index + 1 > length - 1) {
                    scope.firstStep();
                } else {
                    scope.index++;
                }
            };

            scope.lastStep = function () {
                scope.index = length - 1;
            };
        }
    }
}());