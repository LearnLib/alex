(function () {
    'use strict';

    angular
        .module('ALEX.core')
        .directive('responsiveIframe', responsiveIframe);

    responsiveIframe.$inject = ['$window'];

    /**
     * This directive changes the dimensions of an element to its parent element. Optionally you can trigger this
     * behaviour by passing the value 'true' to the parameter bindResize so that every time the window resizes,
     * the dimensions of the element will be updated.
     *
     * @param $window
     * @returns {{restrict: string, link: link}}
     */
    function responsiveIframe($window) {
        return {
            restrict: 'A',
            link: link
        };

        function link(scope, el) {
            var parent = el.parent()[0];

            $window.addEventListener('resize', fitToParent);

            scope.$on('$destroy', function(){
                $window.removeEventListener('resize', fitToParent)
            });

            /**
             * Set the element to the dimensions of its parent
             */
            function fitToParent() {
                el[0].setAttribute('width', parent.offsetWidth);
                el[0].setAttribute('height', parent.offsetHeight);
            }

            fitToParent();
        }
    }
}());