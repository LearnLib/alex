(function () {
    'use strict';

    angular
        .module('ALEX.directives')
        .directive('dropdownHover', dropdownHover);

    /**
     * A directive in addition to the dropdown directive from ui-bootstrap. It opens the dropdown menu when entering the
     * trigger element of the menu with the mouse so you don't have to click on it. Place it as attribute 'dropdown-hover'
     * beside 'dropdown' in order to work as expected.
     *
     * @return {{require: string, link: link}}
     */
    function dropdownHover() {
        return {
            restrict: 'A',
            require: 'dropdown',
            link: link
        };

        /**
         * @param scope
         * @param el
         * @param attrs
         * @param ctrl - the ui.bootstrap dropdown controller
         */
        function link(scope, el, attrs, ctrl) {
            el.on('mouseenter', function () {
                scope.$apply(function () {
                    ctrl.toggle(true);
                })
            })
        }
    }
}());