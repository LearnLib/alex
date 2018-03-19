/*
 * Copyright 2018 TU Dortmund
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
                        title: 'Profile',
                        icon: 'fa-user',
                        active: () => this.isState('profile'),
                        display: () => true,
                        click: () => $state.go('profile')
                    },
                    {
                        title: 'Webhooks',
                        icon: 'fa-share-alt',
                        active: () => this.isState('webhooks'),
                        display: () => this.project,
                        click: () => $state.go('webhooks')
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
                        active: () => this.isState('project'),
                        display: () => this.project,
                        click: () => $state.go('project', {projectId: this.project.id})
                    },
                    {
                        title: 'Files',
                        icon: 'fa-file',
                        active: () => this.isState('files'),
                        display: () => this.project,
                        click: () => $state.go('files', {projectId: this.project.id})
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
                        active: () => this.isState('symbols', 'symbol'),
                        display: () => true,
                        click: () => $state.go('symbols', {projectId: this.project.id})
                    },
                    {
                        title: 'Archive',
                        icon: 'fa-archive',
                        active: () => this.isState('symbolsArchive'),
                        display: () => true,
                        click: () => $state.go('symbolsArchive', {projectId: this.project.id})
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
                        active: () => this.isState('test'),
                        display: () => true,
                        click: () => $state.go('test', {projectId: this.project.id})
                    },
                    {
                        title: 'Reports',
                        icon: 'fa-list',
                        active: () => this.isState('testReports', 'testReport'),
                        display: () => true,
                        click: () => $state.go('testReports', {projectId: this.project.id})
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
                        click: () => $state.go('learnerSetup', {projectId: this.project.id})
                    },
                    {
                        title: 'Results',
                        icon: 'fa-sitemap',
                        active: () => this.isState('learnerResults', 'learnerResultsCompare', 'learnerResultsStatistics'),
                        display: () => true,
                        click: () => $state.go('learnerResults', {projectId: this.project.id})
                    },
                    {
                        title: 'Counters',
                        icon: 'fa-list-ol',
                        active: () => this.isState('counters'),
                        display: () => true,
                        click: () => $state.go('counters', {projectId: this.project.id})
                    },
                ]
            }
        ];

        // listen on project open event
        EventBus.on(events.PROJECT_OPENED, (evt, data) => {
            this.project = data.project;
        }, $scope);

        EventBus.on(events.PROJECT_CLOSED, () => {
            this.project = null;
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
        this.$state.go('root');
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
