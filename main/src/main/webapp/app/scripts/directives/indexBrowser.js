(function () {
    'use strict';

    angular
        .module('ALEX.directives')
        .directive('indexBrowser', indexBrowser);

    indexBrowser.$inject = ['paths'];

    /**
     * The directive that displays a pagination like button group for clicking through elements of a list. Displays
     * the current index and the length of the list.
     *
     * Attribute 'index' is the model of the current index
     * Attribute 'length' should be the length of the list as string
     *
     * Use: '<index-browser index="..." length="{{list.length}}"></index-browser>'
     *
     * @param paths - the application paths constant
     * @returns {{templateUrl: string, scope: {length: string, index: string}, link: link}}
     */
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

            // the length of the array
            var length = parseInt(scope.length);

            // update length on change so that it can be clicked that far in the template
            scope.$watch('length', function (n) {
                if (angular.isDefined(n)) {
                    length = n;
                    scope.lastStep();
                }
            });

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