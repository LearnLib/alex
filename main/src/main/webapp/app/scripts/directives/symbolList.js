(function () {
    'use strict';

    angular
        .module('ALEX.directives')
        .directive('symbolList', symbolList)
        .directive('symbolListItem', symbolListItem);

    symbolListItem.$inject = ['paths'];

    function symbolList() {
        return {
            transclude: true,
            template: '<div class="symbol-list" ng-transclude></div>'
        }
    }

    function symbolListItem(paths) {
        return {
            replace: true,
            transclude: true,
            scope: {
                symbol: '='
            },
            templateUrl: paths.views.DIRECTIVES + '/symbol-list-item.html',
            link: function(scope, el, attrs){
                scope.isSelectable = angular.isDefined(attrs.selectionModel) ? true : false;
                scope.showActionsLink = angular.isDefined(attrs.showActionsLink) ? true : false;
            }
        }
    }
}());