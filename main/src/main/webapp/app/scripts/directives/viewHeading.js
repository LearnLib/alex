(function () {
    'use strict';

    angular
        .module('weblearner.directives')
        .directive('viewHeading', viewHeading);

    viewHeading.$inject = ['paths'];

    /**
     * A directive that is used as a shortcut for the heading of a page to save some coding. Use it on every page that
     * should have a header with a title and a sub-title. The directive accepts two parameters 'title' and 'subTile'
     * which both only accept static values.
     *
     * Use it like '<view-heading title="..." sub-title="..."></view-heading>'
     *
     * The template can be found and changed at 'views/directives/view-heading.html'
     *
     * @returns {{scope: {title: string, subTitle: string}, templateUrl: string}}
     */
    function viewHeading(paths) {
        return {
            scope: {
                title: '@',
                subTitle: '@'
            },
            templateUrl: paths.views.DIRECTIVES + '/view-heading.html'
        }
    }
}());