import {events} from '../constants';

/** The controller for the sidebar */
// @ngInject
class Sidebar {

    /**
     * Constructor
     * @param $scope
     * @param $state
     * @param SessionService
     * @param EventBus
     */
    constructor($scope, $state, SessionService, EventBus) {
        this.$state = $state;
        this.SessionService = SessionService;

        /**
         * The project that is stored in the session
         * @type {Project|null}
         */
        this.project = this.SessionService.project.get();

        /**
         * The user that is in the session
         * @type {User|null}
         */
        this.user = this.SessionService.user.get();

        /**
         * Indicator for the collapsed state
         * @type {boolean}
         */
        this.collapsed = false;

        // listen on project open event
        EventBus.on(events.PROJECT_OPENED, (evt, data) => {
            this.project = data.project;
        }, $scope);

        // listen on user login event
        EventBus.on(events.USER_LOGGED_IN, (evt, data) => {
            this.user = data.user;
        }, $scope);
    }

    /** Removes the project object from the session and redirect to the start page */
    closeProject() {
        this.SessionService.project.remove();
        this.project = null;
        this.$state.go('projects');
    }

    /** Remove project & user from the session */
    logout() {
        this.SessionService.project.remove();
        this.SessionService.user.remove();
        this.user = null;
        this.$state.go('home');
    }

    /** Toggles the collapsed state **/
    toggleCollapse() {
        this.collapsed = !this.collapsed;
    }

    /**
     * Checks if at least one of the passed arguments is the current state name. Arguments should be strings
     *
     * @param {...String} states
     * @returns {boolean}
     */
    isState(...states) {
        let result = false;
        for (let i = 0; i < states.length; i++) {
            result = result || this.$state.current.name === arguments[i];
        }
        return result;
    }
}

const sidebar = {
    controller: Sidebar,
    controllerAs: 'vm',
    templateUrl: 'views/directives/sidebar.html'
};

export default sidebar;