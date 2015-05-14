(function () {
    'use strict';

    angular
        .module('ALEX.core')
        .directive('learnResultList', learnResultList)
        .directive('learnResultListItem', learnResultListItem);

    learnResultListItem.$inject = ['paths'];

    function learnResultList() {
        return {
            transclude: true,
            template: '<div class="learn-result-list" ng-transclude></div>'
        }
    }

    function learnResultListItem(paths) {
        return {
            transclude: true,
            scope: {
                result: '='
            },
            templateUrl: paths.COMPONENTS + '/core/views/directives/learn-result-list-item.html'
        }
    }
}());