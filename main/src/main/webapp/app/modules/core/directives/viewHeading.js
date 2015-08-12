(function () {
    'use strict';

    angular
        .module('ALEX.core')
        .directive('viewHeader', viewHeader);

    viewHeader.$inject = ['paths'];

    /**
     * A directive that is used as a shortcut for the heading of a page to save some coding. Use it on every page that
     * should have a header with a title and a sub-title. The directive accepts a parameter 'title' and 'subTile' which
     * only accept static values.
     *
     * Is transcludable so that child elements can be added before the title. So just add buttons or additional text
     * there.
     *
     * Use it like '<view-heading title="..."> ... </view-heading>'
     *
     * Template: 'views/directives/view-header.html'
     *
     * @returns {{scope: {title: string, subTitle: string}, transclude: boolean, templateUrl: string}}
     */
    function viewHeader(paths) {
        return {
            scope: {
                title: '@'
            },
            transclude: true,
            templateUrl: paths.COMPONENTS + '/core/views/directives/view-header.html'
        }
    }
}());