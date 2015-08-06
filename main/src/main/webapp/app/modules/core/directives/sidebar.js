(function () {
    'use strict';

    angular
        .module('ALEX.core')
        .directive('sidebar', navigation);

    navigation.$inject = ['paths', '$state', 'SessionService'];

    function navigation(paths, $state, Session) {
        return {
            scope: {},
            replace: true,
            templateUrl: paths.COMPONENTS + '/core/views/directives/sidebar.html',
            link: link
        };

        function link(scope) {

            /**
             * The project that is stored in the session
             * @type {Project|null}
             */
            scope.project = Session.project.get();

            /**
             * Indicator for the collapsed state
             * @type {boolean}
             */
            scope.collapsed = false;

            // handle events and stuff
            (function init() {

                // load project into scope when projectOpened is emitted
                scope.$on('project.opened', function () {
                    scope.project = Session.project.get();
                });

                // delete project from scope when projectOpened is emitted
                scope.$on('project.closed', function () {
                    scope.project = null;
                });
            }());

            /** Removes the project object from the session and redirect to the start page */
            scope.closeProject = function () {
                Session.project.remove();
                $state.go('home');
            };

            /** Toggles the collapsed state **/
            scope.toggleCollapse = function () {
                scope.collapsed = !scope.collapsed;
            };

            /**
             * Checks if at least one of the passed arguments is the current state name. Arguments should be strings
             * Use: isState('state1', 'state2', ...)
             */
            scope.isState = function () {
                var result = false;
                for (var i = 0; i < arguments.length; i++) {
                    result = result || $state.current.name === arguments[i];
                }
                return result;
            };
        }
    }
}());