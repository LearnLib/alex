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

/**
 * Define application routes.
 */
// @ngInject
export function config($stateProvider, $urlRouterProvider) {

    // redirect to the start page when no other route fits
    $urlRouterProvider.otherwise('/home');

    $stateProvider
        .state('home', {
            url: '/home',
            template: '<home-view></home-view>',
            data: {title: 'Automata Learning EXperience'}
        })
        .state('usersSettings', {
            url: '/users/settings',
            template: '<users-settings-view></users-settings-view>',
            data: {requiresProject: false, roles: ['REGISTERED', 'ADMIN'], title: 'Settings'}
        })
        .state('adminUsers', {
            url: '/admin/users',
            template: '<admin-users-view></admin-users-view>',
            data: {requiresProject: false, roles: ['ADMIN'], title: 'Admin > Users'}
        })
        .state('adminSettings', {
            url: '/admin/settings',
            template: '<admin-settings-view></admin-settings-view>',
            data: {requiresProject: false, roles: ['ADMIN'], title: 'Application Settings'}
        })
        .state('projects', {
            url: '/projects',
            template: '<projects-view></projects-view>',
            data: {roles: ['REGISTERED', 'ADMIN'], title: 'Projects'}
        })
        .state('projectsDashboard', {
            url: '/projects/dashboard',
            template: '<projects-dashboard-view></projects-dashboard-view>',
            data: {requiresProject: true, roles: ['REGISTERED', 'ADMIN'], title: 'Dashboard'}
        })
        .state('counters', {
            url: '/counters',
            template: '<counters-view></counters-view>',
            data: {requiresProject: true, roles: ['REGISTERED', 'ADMIN'], title: 'Counters'}
        })
        .state('symbols', {
            url: '/symbols',
            template: '<symbols-view></symbols-view>',
            data: {requiresProject: true, roles: ['REGISTERED', 'ADMIN'], title: 'Symbols'}
        })
        .state('symbolsTrash', {
            url: '/symbols/trash',
            template: '<symbols-trash-view></symbols-trash-view>',
            data: {requiresProject: true, roles: ['REGISTERED', 'ADMIN'], title: 'Symbols > Trash'}
        })
        .state('symbolsActions', {
            url: '/symbols/{symbolId:int}/actions',
            template: '<symbols-actions-view></symbols-actions-view>',
            data: {requiresProject: true, roles: ['REGISTERED', 'ADMIN'], title: 'Symbols > Actions'}
        })
        .state('learnerSetup', {
            url: '/learner/setup',
            template: '<learner-setup-view></learner-setup-view>',
            data: {requiresProject: true, roles: ['REGISTERED', 'ADMIN'], title: 'Learner > Setup'}
        })
        .state('learnerStart', {
            url: '/learner/learn',
            template: '<learner-view></learner-view>',
            data: {requiresProject: true, roles: ['REGISTERED', 'ADMIN'], title: 'Learning'},
            params: {result: null}
        })
        .state('results', {
            url: '/results',
            template: '<results-view></results-view>',
            data: {requiresProject: true, roles: ['REGISTERED', 'ADMIN'], title: 'Results'}
        })
        .state('resultsCompare', {
            url: '/results/{testNos:string}',
            template: '<results-compare-view></results-compare-view>',
            data: {requiresProject: true, roles: ['REGISTERED', 'ADMIN'], title: 'Results > Compare'}
        })
        .state('statisticsCompare', {
            url: '/statistics/{testNos:string}',
            template: '<statistics-compare-view></statistics-compare-view>',
            data: {requiresProject: true, roles: ['REGISTERED', 'ADMIN'], title: 'Statistics > Compare'}
        })
        .state('tests', {
            url: '/tests/{testId:int}',
            template: '<tests-view></tests-view>',
            data: {requiresProject: true, roles: ['REGISTERED', 'ADMIN'], title: 'Tests'},
            params: {
                testId: null
            }
        })
        .state('testReports', {
            url: '/tests/reports',
            template: '<test-reports-view></test-reports-view>',
            data: {requiresProject: true, roles: ['REGISTERED', 'ADMIN'], title: 'Tests > Reports'}
        })
        .state('testReport', {
            url: '/tests/reports/{id:int}',
            template: '<test-report-view></test-report-view>',
            data: {requiresProject: true, roles: ['REGISTERED', 'ADMIN'], title: 'Tests > Reports'}
        })
        .state('about', {
            url: '/about',
            template: '<about-view></about-view>',
            data: {title: 'About'}
        })
        .state('error', {
            url: '/error',
            template: '<error-view></error-view>',
            data: {title: 'Error'}
        })
        .state('files', {
            url: '/files',
            template: '<files-view></files-view>',
            data: {requiresProject: true, roles: ['REGISTERED', 'ADMIN'], title: 'Files'}
        });
}

/**
 * Validate routes on state change.
 *
 * @param {TransitionService} $transitions
 * @param {SessionService} SessionService
 * @param {ToastService} ToastService
 */
// @ngInject
export function run($transitions, SessionService, ToastService) {

    // route validation
    $transitions.onBefore({}, onBefore, {});
    $transitions.onSuccess({}, onSuccess, {});

    function onBefore(transition) {
        const user = SessionService.getUser();
        const project = SessionService.getProject();

        const data = transition.to().data;
        if ((data.roles && (user === null || data.roles.indexOf(user.role) === -1))
            || (data.requiresProject && project === null)) {

            ToastService.danger('You cannot access this page!');
            return transition.router.stateService.target('home');
        }
    }

    function onSuccess(transition) {
        document.querySelector('title').innerHTML = 'ALEX | ' + transition.to().data.title;
    }
}
