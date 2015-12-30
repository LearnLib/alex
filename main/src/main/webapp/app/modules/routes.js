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
            templateUrl: 'views/pages/home.html'
        })
        .state('usersSettings', {
            url: '/users/settings',
            templateUrl: 'views/pages/users-settings.html',
            data: {requiresProject: false, roles: ['REGISTERED', 'ADMIN']}
        })
        .state('projects', {
            url: '/projects',
            templateUrl: 'views/pages/projects.html',
            data: {roles: ['REGISTERED', 'ADMIN']}
        })
        .state('projectsDashboard', {
            url: '/projects/dashboard',
            templateUrl: 'views/pages/projects-dashboard.html',
            data: {requiresProject: true, roles: ['REGISTERED', 'ADMIN']}
        })
        .state('counters', {
            url: '/counters',
            templateUrl: 'views/pages/counters.html',
            data: {requiresProject: true, roles: ['REGISTERED', 'ADMIN']}
        })
        .state('symbols', {
            url: '/symbols',
            templateUrl: 'views/pages/symbols.html',
            data: {requiresProject: true, roles: ['REGISTERED', 'ADMIN']}
        })
        .state('symbolsTrash', {
            url: '/symbols/trash',
            templateUrl: 'views/pages/symbols-trash.html',
            data: {requiresProject: true, roles: ['REGISTERED', 'ADMIN']}
        })
        .state('symbolsHistory', {
            url: '/symbols/{symbolId:int}/history',
            templateUrl: 'views/pages/symbols-history.html',
            data: {requiresProject: true, roles: ['REGISTERED', 'ADMIN']}
        })
        .state('symbolsActions', {
            url: '/symbols/{symbolId:int}/actions',
            templateUrl: 'views/pages/symbols-actions.html',
            data: {requiresProject: true, roles: ['REGISTERED', 'ADMIN']}
        })
        .state('symbolsImport', {
            url: '/symbols/import',
            templateUrl: 'views/pages/symbols-import.html',
            data: {requiresProject: true, roles: ['REGISTERED', 'ADMIN']}
        })
        .state('learnerSetup', {
            url: '/learner/setup',
            templateUrl: 'views/pages/learner-setup.html',
            data: {requiresProject: true, roles: ['REGISTERED', 'ADMIN']}
        })
        .state('learnerStart', {
            url: '/learner/start',
            templateUrl: 'views/pages/learner-start.html',
            data: {requiresProject: true, roles: ['REGISTERED', 'ADMIN']}
        })
        .state('results', {
            url: '/results',
            templateUrl: 'views/pages/results.html',
            data: {requiresProject: true, roles: ['REGISTERED', 'ADMIN']}
        })
        .state('resultsCompare', {
            url: '/results/:testNos/compare',
            templateUrl: 'views/pages/results-compare.html',
            data: {requiresProject: true, roles: ['REGISTERED', 'ADMIN']}
        })
        .state('statistics', {
            url: '/statistics',
            templateUrl: 'views/pages/statistics.html',
            data: {requiresProject: true, roles: ['REGISTERED', 'ADMIN']}
        })
        .state('statisticsCompare', {
            url: '/statistics/{testNos:string}/compare/{mode:string}',
            templateUrl: 'views/pages/statistics-compare.html',
            data: {requiresProject: true, roles: ['REGISTERED', 'ADMIN']}
        })
        .state('adminUsers', {
            url: '/admin/users',
            templateUrl: 'views/pages/admin-users.html',
            data: {requiresProject: false, roles: ['ADMIN']}
        })
        .state('about', {
            url: '/about',
            templateUrl: 'views/pages/about.html',
            data: {}
        })
        .state('error', {
            url: '/error',
            templateUrl: 'views/pages/error.html'
        })
        .state('files', {
            url: '/files',
            templateUrl: 'views/pages/files.html',
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