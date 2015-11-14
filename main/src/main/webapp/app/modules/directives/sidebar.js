import {events} from '../constants';

// @ngInject
function sidebar($state, SessionService, EventBus) {
    return {
        scope: {},
        replace: true,
        templateUrl: 'views/directives/sidebar.html',
        link: link
    };

    function link(scope) {

        /**
         * The project that is stored in the session
         * @type {Project|null}
         */
        scope.project = SessionService.project.get();

        /**
         * The user that is in the session
         * @type {User|null}
         */
        scope.user = SessionService.user.get();

        /**
         * Indicator for the collapsed state
         * @type {boolean}
         */
        scope.collapsed = false;

        // listen on project open event
        EventBus.on(events.PROJECT_OPENED, (evt, data) => {
            scope.project = data.project;
        }, scope);

        // listen on user login event
        EventBus.on(events.USER_LOGGED_IN, (evt, data) => {
            scope.user = data.user;
        }, scope);

        /** Removes the project object from the session and redirect to the start page */
        scope.closeProject = function () {
            SessionService.project.remove();
            scope.project = null;
            $state.go('projects');
        };

        /** Remove project & user from the session */
        scope.logout = function () {
            SessionService.project.remove();
            SessionService.user.remove();
            scope.user = null;
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
            let result = false;
            for (let i = 0; i < arguments.length; i++) {
                result = result || $state.current.name === arguments[i];
            }
            return result;
        };
    }
}

export default sidebar;