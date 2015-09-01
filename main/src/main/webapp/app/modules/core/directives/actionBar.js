(function () {
    'use strict';

    angular
        .module('ALEX.core')
        .directive('actionBar', actionBar);

    actionBar.$inject = ['$window'];

    /**
     * The directive that is used for the sticky sub navigation that mostly contains call to action buttons for the
     * current view
     *
     * Use: '<div action-bar></div>'
     *
     * @param $window - angular $window
     * @returns {{replace: boolean, transclude: boolean, template: string, link: link}}
     */
    function actionBar($window) {

        var template = '' +
            '<div class="action-bar" layout-toggle-element>' +
            '   <div class="alx-container-fluid" ng-transclude></div>' +
            '</div>';

        return {
            replace: true,
            transclude: true,
            template: template,
            link: link
        };

        function link(scope, el) {
            var body = angular.element(document.body);

            $window.addEventListener('scroll', handleResize);

            scope.$on('$destroy', function () {
                $window.removeEventListener('scroll', handleResize);
                body.removeClass('has-fixed-action-bar');
            });

            function handleResize() {
                if ($window.scrollY >= 42) {
                    el.addClass('fixed');
                    body.addClass('has-fixed-action-bar');
                } else {
                    el.removeClass('fixed');
                    body.removeClass('has-fixed-action-bar');
                }
            }
        }
    }
}());
