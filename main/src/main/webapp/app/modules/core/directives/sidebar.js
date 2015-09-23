(function () {
    'use strict';

    angular
        .module('ALEX.core')
        .directive('sidebar', navigation);

    navigation.$inject = ['$rootScope', 'paths', '$state', 'SessionService'];

    function navigation($rootScope, paths, $state, Session) {
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

            scope.user = Session.user.get();

            /**
             * Indicator for the collapsed state
             * @type {boolean}
             */
            scope.collapsed = false;

            // handle events and stuff
            (function init() {

                // load project into scope when projectOpened is emitted
                $rootScope.$on('project:opened', function (event, project) {
                    scope.project = project;
                });

                // delete project from scope when projectOpened is emitted
                $rootScope.$on('project:closed', function () {
                    scope.project = null;
                });

                $rootScope.$on('user:loggedIn', function (event, user) {
                    scope.user = user;
                });

                $rootScope.$on('user:loggedOut', function () {
                    scope.user = null;
                })
            }());

            /** Removes the project object from the session and redirect to the start page */
            scope.closeProject = function () {
                Session.project.remove();
                $state.go('projects');
            };

            /** Remove project & user from the session */
            scope.logout = function () {
                Session.project.remove();
                Session.user.remove();
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