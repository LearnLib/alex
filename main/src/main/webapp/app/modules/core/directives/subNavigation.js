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

            // get element height for the placeholder element
            var height = el[0].offsetHeight;

            // create, configure, hide & append the placeholder element after the element
            var placeholder = document.createElement('div');
            placeholder.style.height = height + 'px';
            placeholder.style.display = 'none';
            el.after(placeholder);

            // listen to window scroll event and add or remove the specified class to or from the element
            // and show or hide the placeholder for a smooth scrolling behaviour
            angular.element($window).on('scroll', function () {
                if ($window.scrollY >= scrollTop) {
                    if (!el.hasClass(cssClass)) {
                        placeholder.style.display = 'block';
                        el.addClass(cssClass);
                    }
                } else {
                    if (el.hasClass(cssClass)) {
                        placeholder.style.display = 'none';
                        el.removeClass(cssClass);
                    }
                }
            })
        }
    }
}());
