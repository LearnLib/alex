(function () {
    'use strict';

    angular
        .module('ALEX.core')
        .directive('learnResultComparePanel', learnResultComparePanel);

    function learnResultComparePanel() {
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