(function () {
    'use strict';

    angular
        .module('weblearner.directives')
        .directive('viewHeading', viewHeading);

    function viewHeading() {

        var template = '' +
            '<div class="view-heading">' +
            '   <div class="container">' +
            '       <h2 class="view-heading-title" ng-bind="::title"></h2>' +
            '       <p class="view-heading-sub-title" ng-bind="::subTitle"></p>' +
            '   </div>' +
            '</div>';

        return {
            scope: {
                title: '@',
                subTitle: '@'
            },
            template: template
        }
    }
}());