(function () {
    'use strict';

    angular
        .module('ALEX.directives')
        .directive('learnResultList', learnResultList)
        .directive('learnResultListItem', learnResultListItem);

    function learnResultList() {
        return {
            transclude: true,
            template: '<div class="learn-result-list" ng-transclude></div>'
        }
    }

    function learnResultListItem() {
        return {
            transclude: true,
            scope: {
                result: '='
            },
            templateUrl: 'views/directives/learn-result-list-item.html'
        }
    }
}());