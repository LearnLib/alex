(function () {
    'use strict';

    angular
        .module('ALEX.core')
        .directive('subNavigation', subNavigation);

    /**
     * The directive that is used for the sticky sub navigation that mostly contains call to action buttons for the
     * current view
     *
     * Use: '<div sub-navigation></div>'
     *
     * @returns {{link: link}}
     */
    function subNavigation() {

        var template = '' +
            '<div class="sub-nav">' +
            '   <div class="alx-container-fluid" ng-transclude></div>' +
            '</div>';

        return {
            replace: true,
            transclude: true,
            template: template
        };
    }
}());
