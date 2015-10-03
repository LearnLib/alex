(function () {
    'use strict';

    angular
        .module('ALEX.core')
        .config(config)
        .run(run);

    config.$inject = ['$stateProvider', '$urlRouterProvider', 'paths'];
    run.$inject = ['$rootScope', '$state', 'SessionService', 'ToastService'];

    /**
     * Define application routes
     */
    function config($stateProvider, $urlRouterProvider, paths) {

        // redirect to the start page when no other route fits
        $urlRouterProvider.otherwise("/home");

        $stateProvider

            // =========================================================
            // index route

            .state('home', {
                url: '/home',
                templateUrl: paths.COMPONENTS + '/core/views/pages/home.html',
                controller: 'HomeController'
            })

            .state('dashboard', {
                url: '/dashboard',
                views: {
                    '@': {
                        templateUrl: paths.COMPONENTS + '/core/views/pages/dashboard.html'
                    }
                },
                data: {requiresProject: true, roles: ['REGISTERED', 'ADMIN']}
            })

            // =========================================================
            // user related routes

            .state('users', {
                abstract: true,
                url: '/users',
                data: {requiresProject: false, roles: ['REGISTERED', 'ADMIN']}
            })
            .state('users.settings', {
                url: '/settings',
                views: {
                    '@': {
                        controller: 'UserSettingsController',
                        templateUrl: paths.COMPONENTS + '/core/views/pages/user-settings.html'
                    }
                }
            })

            // =========================================================
            // project related routes

            .state('projects', {
                url: '/projects',
                views: {
                    '@': {
                        templateUrl: paths.COMPONENTS + '/core/views/pages/projects.html',
                        controller: 'ProjectsController'
                    }
                },
                data: {roles: ['REGISTERED', 'ADMIN']}
            })

            // =========================================================
            // counter related routes

            .state('counters', {
                url: '/counters',
                views: {
                    '@': {
                        templateUrl: paths.COMPONENTS + '/core/views/pages/counters.html',
                        controller: 'CountersController'
                    }
                },
                data: {requiresProject: true, roles: ['REGISTERED', 'ADMIN']}
            })

            // =========================================================
            // symbol related routes

            .state('symbols', {
                url: '/symbols',
                views: {
                    '@': {
                        controller: 'SymbolsController',
                        templateUrl: paths.COMPONENTS + '/core/views/pages/symbols.html'
                    }
                },
                data: {requiresProject: true, roles: ['REGISTERED', 'ADMIN']}
            })
            .state('symbols.trash', {
                url: '/trash',
                views: {
                    '@': {
                        controller: 'SymbolsTrashController',
                        templateUrl: paths.COMPONENTS + '/core/views/pages/symbols-trash.html'
                    }
                },
                data: {requiresProject: true, roles: ['REGISTERED', 'ADMIN']}
            })
            .state('symbols.history', {
                url: '/{symbolId:int}/history',
                views: {
                    '@': {
                        controller: 'SymbolsHistoryController',
                        templateUrl: paths.COMPONENTS + '/core/views/pages/symbols-history.html'
                    }
                },
                data: {requiresProject: true, roles: ['REGISTERED', 'ADMIN']}
            })
            .state('symbols.actions', {
                url: '/{symbolId:int}/actions',
                views: {
                    '@': {
                        controller: 'SymbolsActionsController',
                        templateUrl: paths.COMPONENTS + '/core/views/pages/symbols-actions.html'
                    }
                },
                data: {requiresProject: true, roles: ['REGISTERED', 'ADMIN']}
            })
            .state('symbols.import', {
                url: '/import',
                views: {
                    '@': {
                        controller: 'SymbolsImportController',
                        templateUrl: paths.COMPONENTS + '/core/views/pages/symbols-import.html'
                    }
                },
                data: {requiresProject: true, roles: ['REGISTERED', 'ADMIN']}
            })

            // =========================================================
            // test and learn related routes

            .state('learn', {
                abstract: true,
                url: '/learn',
                data: {requiresProject: true, roles: ['REGISTERED', 'ADMIN']}
            })
            .state('learn.setup', {
                url: '/setup',
                views: {
                    '@': {
                        controller: 'LearnSetupController',
                        templateUrl: paths.COMPONENTS + '/core/views/pages/learn-setup.html'
                    }
                }
            })
            .state('learn.start', {
                url: '/start',
                views: {
                    '@': {
                        controller: 'LearnStartController',
                        templateUrl: paths.COMPONENTS + '/core/views/pages/learn-start.html'
                    }
                }
            })
            .state('learn.results', {
                url: '/results',
                views: {
                    '@': {
                        controller: 'LearnResultsController',
                        templateUrl: paths.COMPONENTS + '/core/views/pages/learn-results.html'
                    }
                }
            })
            .state('learn.results.statistics', {
                url: '/statistics',
                views: {
                    '@': {
                        controller: 'LearnResultsStatisticsController',
                        templateUrl: paths.COMPONENTS + '/core/views/pages/learn-results-statistics.html'
                    }
                }
            })
            .state('learn.results.compare', {
                url: '/compare/:testNos',
                views: {
                    '@': {
                        controller: 'LearnResultsCompareController',
                        templateUrl: paths.COMPONENTS + '/core/views/pages/learn-results-compare.html'
                    }
                }
            })

            // =========================================================
            // admin related routes

            .state('admin', {
                abstract: true,
                url: '/admin',
                data: {requiresProject: false, roles: ['ADMIN']}
            })
            .state('admin.users', {
                url: '/users',
                views: {
                    '@': {
                        controller: 'AdminUsersController',
                        templateUrl: paths.COMPONENTS + '/core/views/pages/admin-users.html'
                    }
                }
            })

            // =========================================================
            // other page routes

            .state('about', {
                url: '/about',
                templateUrl: paths.COMPONENTS + '/core/views/pages/about.html',
                data: {}
            })

            .state('error', {
                url: '/error',
                controller: 'ErrorController',
                templateUrl: paths.COMPONENTS + '/core/views/pages/error.html'
            })

            .state('files', {
                url: '/files',
                controller: 'FilesController',
                templateUrl: paths.COMPONENTS + '/core/views/pages/files.html',
                data: {requiresProject: true, roles: ['REGISTERED', 'ADMIN']}
            })
    }

    /**
     * Validate routes on state change
     */
    function run($rootScope, $state, Session, Toast) {
        // route validation
        $rootScope.$on("$stateChangeStart", stateChangeStart);

        function stateChangeStart(event, toState) {
            if (toState.data) {
                var user = Session.user.get();
                var project = Session.project.get();

                if ((toState.data.roles && (user === null || toState.data.roles.indexOf(user.role) === -1))
                    || (toState.data.requiresProject && project === null)) {

                    Toast.danger('You are not allowed to go to this page!');

                    $state.go("home");
                    event.preventDefault();
                }
            }
        }
    }
}());