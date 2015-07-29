(function () {
    'use strict';

    angular
        .module('ALEX.core')
        .directive('subNavigation', subNavigation);

    subNavigation.$inject = ['$window'];

    /**
     * The directive that is used for the sticky sub navigation that mostly contains call to action buttons for the
     * current view
     *
     * Use: '<div sub-navigation></div>'
     *
     * @param $window - The angular window wrapper
     * @returns {{link: link}}
     */
    function subNavigation($window) {

        var template = '' +
            '<div class="sub-nav">' +
            '   <div class="container" ng-transclude></div>' +
            '</div>';

        return {
            link: link,
            replace: true,
            transclude: true,
            template: template
        };

        function link(scope, el) {
            var scrollTop = 115;    // px
            var cssClass = 'fixed';

            // create, configure, hide & append the placeholder element after the element
            var placeholder = document.createElement('div');
            placeholder.style.height = el[0].offsetHeight + 'px';
            placeholder.style.display = 'none';
            el.after(placeholder);

            // listen to window scroll event and add or remove the specified class to or from the element
            // and show or hide the placeholder for a smooth scrolling behaviour
            $window.addEventListener('scroll', handleScroll);

            // remove the scroll event if scope is destroyed
            scope.$on('$destroy', function () {
                $window.removeEventListener('scroll', handleScroll)
            });

            function handleScroll() {
                if ($window.scrollY >= scrollTop) {
                    placeholder.style.display = 'block';
                    el.addClass(cssClass);
                } else {
                    placeholder.style.display = 'none';
                    el.removeClass(cssClass);
                }
            }
        }
    }
}());
