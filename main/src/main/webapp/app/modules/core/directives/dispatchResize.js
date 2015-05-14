(function () {
    'use strict';

    angular
        .module('ALEX.core')
        .directive('dispatchResize', dispatchResize);

    /**
     * This directive is used to fire a resize event to the window element with a given delay. Therefore it adds
     * a click event to element the directive was used on.
     *
     * Directive must be used as attribute with a value that indicates how long resize event firing should be delayed
     * (in ms). When no value is given, the resize event is fired directly with a delay of 0 ms.
     *
     * Use: <button dispatch-resize="1000">Click Me!</button>
     *
     * @returns {{link: link}}
     */
    function dispatchResize() {

        // the directive
        return {
            restrict: 'A',
            link: link
        };

        // the directives behavior
        function link(scope, el, attrs) {
            el.on('click', function () {
                var delay = 0;
                if (attrs.dispatchResize && angular.isNumber(parseInt(attrs.dispatchResize))) {
                    delay = parseInt(attrs.dispatchResize);
                }
                window.setTimeout(function () {
                    window.dispatchEvent(new Event('resize'));
                }, delay);
            })
        }
    }
}());