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

/**
 * The controller for the sidebar.
 */
class SidebarComponent {

    /**
     * Constructor.
     *
     * @param $state
     * @param projectService
     * @param userService
     * @param uiService
     */
    // @ngInject
    constructor($state, projectService, userService, uiService) {
        this.$state = $state;
        this.projectService = projectService;
        this.userService = userService;
        this.uiService = uiService;

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
                        title: 'Settings',
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
                        click: () => $state.go('test', {projectId: this.project.id, testId: null})
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
                        title: 'Lts Formulas',
                        icon: 'fa-subscript',
                        active: () => this.isState('ltsFormulas'),
                        display: () => true,
                        click: () => $state.go('ltsFormulas', {projectId: this.project.id})
                    },
                    {
                        title: 'Counters',
                        icon: 'fa-list-ol',
                        active: () => this.isState('counters'),
                        display: () => true,
                        click: () => $state.go('counters', {projectId: this.project.id})
                    },
                ]
            },
            {
                title: () => 'Integrations',
                display: () => this.user,
                items: [
                    {
                        title: 'Webhooks',
                        icon: 'fa-share-alt',
                        active: () => this.isState('webhooks'),
                        display: () => this.user,
                        click: () => $state.go('webhooks')
                    }
                ]
            }
        ];
    }

    /** Removes the project object from the session and redirect to the start page. */
    closeProject() {
        this.projectService.close();
        this.$state.go('projects');
    }

    /** Remove project & user from the session. */
    logout() {
        this.projectService.close();
        this.userService.logout();
        this.$state.go('root');
    }

    /** Toggles the collapsed state. */
    toggleCollapse() {
        this.uiService.toggleSidebar();
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

    get project() {
        return this.projectService.store.currentProject;
    }

    get user() {
        return this.userService.store.currentUser;
    }

    get collapsed() {
        return this.uiService.store.sidebar.collapsed;
    }
}

export const sidebarComponent = {
    template: require('./sidebar.component.html'),
    controller: SidebarComponent,
    controllerAs: 'vm'
};
