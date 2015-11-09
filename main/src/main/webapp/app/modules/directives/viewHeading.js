(function () {
    'use strict';

    angular
        .module('ALEX.directives')
        .directive('viewHeader', viewHeader);

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
     * @returns {{scope: {title: string}, transclude: boolean, template: string}}
     */
    function viewHeader() {
        return {
            scope: {
                title: '@'
            },
            transclude: true,
            template: `
                <div class="view-header">
                    <div class="alx-container-fluid">
                        <div class="view-header-title-pre" ng-transclude></div>
                        <h2 class="view-header-title" ng-bind="title"></h2>
                    </div>
                </div>
            `
        }
    }
}());