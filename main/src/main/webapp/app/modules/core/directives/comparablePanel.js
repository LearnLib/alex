(function () {
    'use strict';

    angular
        .module('ALEX.core')
        .directive('comparablePanel', comparablePanel);

    function comparablePanel() {
        return {
            scope: {
                index: '@',
                from: '@'
            },
            link: link
        };

        function link(scope, el) {
            scope.$watch('from', function () {
                var from = scope.from || 1;
                var index = scope.index || 0;
                el[0].style.width = (100 / from) + '%';
                el[0].style.left = ((100 / from) * (index)) + '%';
            });
        }
    }
}());