(function () {
    'use strict';

    angular
        .module('ALEX.directives')
        .directive('navigation', navigation);

    navigation.$inject = ['paths', '$state', 'SessionService'];

    /**
     * The directive for the main navigation of the app. Converts into a off screen navigation as soon as the screen
     * is minimized.
     *
     * Use: '<navigation></navigation>'
     *
     * !! Place it at the top of your DOM before the main content part
     *
     * @param paths - The applications paths constant
     * @param $state - The ui.router $state service
     * @param Session - The SessionService
     * @returns {{scope: {}, templateUrl: string, link: link}}
     */
    function navigation(paths, $state, Session) {
        return {
            scope: {},
            templateUrl: paths.views.DIRECTIVES + '/navigation.html',
            link: link
        };

        function link(scope, el, attrs) {

            // the button that is used to show or hide the hidden sidebar
            var handle = angular.element(el[0].getElementsByClassName('navbar-menu-handle'));

            // the container of the element that holds the navigation items
            var offscreen = angular.element(el[0].getElementsByClassName('navbar-offscreen'));

            // the css class applied to the nav when it should be displayed off screen
            var offscreenClass = 'show';

            /**
             * The project that is stored in the session
             * @type {Project|null}
             */
            scope.project = Session.project.get();

            // handle events and stuff
            (function init() {
                handle.on('click', toggleNavigation);

                // load project into scope when projectOpened is emitted
                scope.$on('project.opened', function () {
                    scope.project = Session.project.get();
                });

                // delete project from scope when projectOpened is emitted
                scope.$on('project.closed', function () {
                    scope.project = null;
                });
            }());

            /**
             * Removes the project object from the session and redirect to the start page
             */
            scope.closeProject = function () {
                Session.project.remove();
                $state.go('home');
            };

            /**
             * Toggles the class for the navigation so that it is displayed off screen or not
             * @param e - js event
             */
            function toggleNavigation(e) {
                e.stopPropagation();
                offscreen.toggleClass(offscreenClass);
            }
        }
    }
}());