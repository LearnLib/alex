/*
 * Copyright 2016 TU Dortmund
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

import {events} from '../constants';

/** The controller for the sidebar */
// @ngInject
class Sidebar {

    /**
     * Constructor
     * @param $scope
     * @param $document
     * @param $state
     * @param SessionService
     * @param EventBus
     */
    constructor($scope, $document, $state, SessionService, EventBus) {
        this.$state = $state;
        this.SessionService = SessionService;
        this.$document = $document;

        /**
         * The project that is stored in the session
         * @type {Project|null}
         */
        this.project = this.SessionService.getProject();

        /**
         * The user that is in the session
         * @type {User|null}
         */
        this.user = this.SessionService.getUser();

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
        this.SessionService.removeProject();
        this.project = null;
        this.$state.go('projects');
    }

    /** Remove project & user from the session */
    logout() {
        this.SessionService.removeProject();
        this.SessionService.removeUser();
        this.user = null;
        this.$state.go('home');
    }

    /** Toggles the collapsed state **/
    toggleCollapse() {
        this.collapsed = !this.collapsed;
        const body = this.$document[0].body;
        if (this.collapsed) {
            body.classList.add('layout-collapsed');
        } else {
            body.classList.remove('layout-collapsed');
        }
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