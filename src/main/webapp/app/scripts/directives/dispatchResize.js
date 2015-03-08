(function () {
    'use strict';

    angular
        .module('weblearner.directives')
        .directive('dispatchResize', dispatchResize);

    function dispatchResize() {

        var directive = {
            link: link
        };
        return directive;

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