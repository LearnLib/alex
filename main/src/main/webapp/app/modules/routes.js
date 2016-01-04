/**
 * Define application routes
 */
// @ngInject
function config($stateProvider, $urlRouterProvider) {

    // redirect to the start page when no other route fits
    $urlRouterProvider.otherwise("/home");

    $stateProvider
        .state('home', {
            url: '/home',
            template: '<home-view></home-view>'
        })
        .state('usersSettings', {
            url: '/users/settings',
            template: '<users-settings-view></users-settings-view>',
            data: {requiresProject: false, roles: ['REGISTERED', 'ADMIN']}
        })
        .state('projects', {
            url: '/projects',
            template: '<projects-view></projects-view>',
            data: {roles: ['REGISTERED', 'ADMIN']}
        })
        .state('projectsDashboard', {
            url: '/projects/dashboard',
            template: '<projects-dashboard-view></projects-dashboard-view>',
            data: {requiresProject: true, roles: ['REGISTERED', 'ADMIN']}
        })
        .state('counters', {
            url: '/counters',
            template: '<counters-view></counters-view>',
            data: {requiresProject: true, roles: ['REGISTERED', 'ADMIN']}
        })
        .state('symbols', {
            url: '/symbols',
            template: '<symbols-view></symbols-view>',
            data: {requiresProject: true, roles: ['REGISTERED', 'ADMIN']}
        })
        .state('symbolsTrash', {
            url: '/symbols/trash',
            template: '<symbols-trash-view></symbols-trash-view>',
            data: {requiresProject: true, roles: ['REGISTERED', 'ADMIN']}
        })
        .state('symbolsHistory', {
            url: '/symbols/{symbolId:int}/history',
            template: '<symbols-history-view></symbols-history-view>',
            data: {requiresProject: true, roles: ['REGISTERED', 'ADMIN']}
        })
        .state('symbolsActions', {
            url: '/symbols/{symbolId:int}/actions',
            template: '<symbols-actions-view></symbols-actions-view>',
            data: {requiresProject: true, roles: ['REGISTERED', 'ADMIN']}
        })
        .state('symbolsImport', {
            url: '/symbols/import',
            template: '<symbols-import-view></symbols-import-view>',
            data: {requiresProject: true, roles: ['REGISTERED', 'ADMIN']}
        })
        .state('learnerSetup', {
            url: '/learner/setup',
            template: '<learner-setup-view></learner-setup-view>',
            data: {requiresProject: true, roles: ['REGISTERED', 'ADMIN']}
        })
        .state('learnerStart', {
            url: '/learner/start',
            template: '<learner-start-view></learner-start-view>',
            data: {requiresProject: true, roles: ['REGISTERED', 'ADMIN']}
        })
        .state('results', {
            url: '/results',
            template: '<results-view></results-view>',
            data: {requiresProject: true, roles: ['REGISTERED', 'ADMIN']}
        })
        .state('resultsCompare', {
            url: '/results/:testNos/compare',
            template: '<results-compare-view></results-compare-view>',
            data: {requiresProject: true, roles: ['REGISTERED', 'ADMIN']}
        })
        .state('statistics', {
            url: '/statistics',
            template: '<statistics-view></statistics-view>',
            data: {requiresProject: true, roles: ['REGISTERED', 'ADMIN']}
        })
        .state('statisticsCompare', {
            url: '/statistics/{testNos:string}/compare/{mode:string}',
            template: '<statistics-compare-view></statistics-compare-view>',
            data: {requiresProject: true, roles: ['REGISTERED', 'ADMIN']}
        })
        .state('adminUsers', {
            url: '/admin/users',
            template: '<admin-users-view></admin-users-view>',
            data: {requiresProject: false, roles: ['ADMIN']}
        })
        .state('about', {
            url: '/about',
            template: '<about-view></about-view>',
            data: {}
        })
        .state('error', {
            url: '/error',
            template: '<error-view></error-view>'
        })
        .state('files', {
            url: '/files',
            template: '<files-view></files-view>',
            data: {requiresProject: true, roles: ['REGISTERED', 'ADMIN']}
        });
}

/**
 * Validate routes on state change
 */
// @ngInject
function run($rootScope, $state, SessionService, ToastService) {

    // route validation
    $rootScope.$on("$stateChangeStart", stateChangeStart);

    function stateChangeStart(event, toState) {
        if (toState.data) {
            const user = SessionService.getUser();
            const project = SessionService.getProject();

            if ((toState.data.roles && (user === null
                || toState.data.roles.indexOf(user.role) === -1))
                || (toState.data.requiresProject && project === null)) {

                ToastService.danger('You are not allowed to go to this page!');

                $state.go("home");
                event.preventDefault();
            }
        }
    }
}

export const routes = {
    config: config,
    run: run
};