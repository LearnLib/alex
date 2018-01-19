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

import {events} from '../../constants';

/**
 * The controller for the sidebar.
 */
class SidebarComponent {

    /**
     * Constructor.
     *
     * @param $scope
     * @param $state
     * @param {SessionService} SessionService
     * @param {EventBus} EventBus
     */
    // @ngInject
    constructor($scope, $state, SessionService, EventBus) {
        this.$state = $state;
        this.SessionService = SessionService;

        /**
         * The project that is stored in the session.
         * @type {Project|null}
         */
        this.project = this.SessionService.getProject();

        /**
         * The user that is in the session.
         * @type {User|null}
         */
        this.user = this.SessionService.getUser();

        /**
         * Indicator for the collapsed state.
         * @type {boolean}
         */
        this.collapsed = sessionStorage.getItem('sidebarCollapsed') === 'true';

        /**
         * The item groups
         * @type {*[]}
         */
        this.groups = [
            {
                title: () => 'User',
                display: () => this.user,
                items: [
                    {
                        title: 'Settings',
                        icon: 'fa-user',
                        active: () => this.isState('usersSettings'),
                        display: () => true,
                        click: () => $state.go('usersSettings')
                    },
                    {
                        title: 'Logout',
                        icon: 'fa-sign-out',
                        active: () => false,
                        display: () => true,
                        click: () => this.logout()
                    }
                ]
            },
            {
                title: () => 'Admin',
                display: () => this.user && this.user.role === 'ADMIN',
                items: [
                    {
                        title: 'App Settings',
                        icon: 'fa-gears',
                        active: () => this.isState('adminSettings'),
                        display: () => true,
                        click: () => $state.go('adminSettings')
                    },
                    {
                        title: 'User Management',
                        icon: 'fa-users',
                        active: () => this.isState('adminUsers'),
                        display: () => true,
                        click: () => $state.go('adminUsers')
                    }
                ]
            },
            {
                title: () => this.project ? this.project.name : 'Projects',
                display: () => this.user,
                items: [
                    {
                        title: 'Overview',
                        icon: 'fa-briefcase',
                        active: () => this.isState('projects'),
                        display: () => !this.project,
                        click: () => $state.go('projects')
                    },
                    {
                        title: 'Dashboard',
                        icon: 'fa-dashboard',
                        active: () => this.isState('projectsDashboard'),
                        display: () => this.project,
                        click: () => $state.go('projectsDashboard')
                    },
                    {
                        title: 'Files',
                        icon: 'fa-file',
                        active: () => this.isState('files'),
                        display: () => this.project,
                        click: () => $state.go('files')
                    },

                    {
                        title: 'Close',
                        icon: 'fa-sign-out',
                        active: () => false,
                        display: () => this.project,
                        click: () => this.closeProject()
                    }
                ]
            },
            {
                title: () => 'Symbols',
                display: () => this.user && this.project,
                items: [
                    {
                        title: 'Manage',
                        icon: 'fa-list-alt',
                        active: () => this.isState('symbols', 'symbolsActions', 'symbolsHistory'),
                        display: () => true,
                        click: () => $state.go('symbols')
                    },
                    {
                        title: 'Trash',
                        icon: 'fa-trash',
                        active: () => this.isState('symbolsTrash'),
                        display: () => true,
                        click: () => $state.go('symbolsTrash')
                    }
                ]
            },
            {
                title: () => 'Testing',
                display: () => this.user && this.project,
                items: [
                    {
                        title: 'Manage',
                        icon: 'fa-wrench',
                        active: () => this.isState('tests'),
                        display: () => true,
                        click: () => $state.go('tests')
                    }
                ]
            },
            {
                title: () => 'Learning',
                display: () => this.user && this.project,
                items: [
                    {
                        title: 'Setup',
                        icon: 'fa-play',
                        active: () => this.isState('learnerSetup', 'learnerStart'),
                        display: () => true,
                        click: () => $state.go('learnerSetup')
                    },
                    {
                        title: 'Results',
                        icon: 'fa-sitemap',
                        active: () => this.isState('results', 'resultsCompare', 'statisticsCompare'),
                        display: () => true,
                        click: () => $state.go('results')
                    },
                    {
                        title: 'Counters',
                        icon: 'fa-list-ol',
                        active: () => this.isState('counters'),
                        display: () => true,
                        click: () => $state.go('counters')
                    },
                ]
            }
        ];

        // listen on project open event
        EventBus.on(events.PROJECT_OPENED, (evt, data) => {
            this.project = data.project;
        }, $scope);

        // listen on user login event
        EventBus.on(events.USER_LOGGED_IN, (evt, data) => {
            this.user = data.user;
        }, $scope);

        this.updateLayout();
    }

    /** Removes the project object from the session and redirect to the start page. */
    closeProject() {
        this.SessionService.removeProject();
        this.project = null;
        this.$state.go('projects');
    }

    /** Remove project & user from the session. */
    logout() {
        this.SessionService.removeProject();
        this.SessionService.removeUser();
        this.user = null;
        this.project = null;
        this.$state.go('home');
    }

    /** Toggles the collapsed state. */
    toggleCollapse() {
        this.collapsed = !this.collapsed;
        sessionStorage.setItem('sidebarCollapsed', this.collapsed);
        this.updateLayout();
    }

    /** Update the class on the body depending on the toggle state. */
    updateLayout() {
        if (this.collapsed) {
            document.body.classList.add('layout-collapsed');
        } else {
            document.body.classList.remove('layout-collapsed');
        }
    }

    /**
     * Checks if at least one of the passed arguments is the current state name. Arguments should be strings.
     *
     * @param {...String} states - The states the item belongs to.
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

export const sidebarComponent = {
    template: require('./sidebar.component.html'),
    controller: SidebarComponent,
    controllerAs: 'vm'
};
