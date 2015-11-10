(function () {
    'use strict';

    angular
        .module('ALEX')
        .config(config)
        .run(run);

    /**
     * Define application routes
     */
    // @ngInject
    function config($stateProvider, $urlRouterProvider) {

        // redirect to the start page when no other route fits
        $urlRouterProvider.otherwise("/home");

        $stateProvider

            // =========================================================
            // index route

            .state('home', {
                url: '/home',
                templateUrl: 'views/pages/home.html'
            })

            .state('dashboard', {
                url: '/dashboard',
                views: {
                    '@': {
                        templateUrl: 'views/pages/project-dashboard.html'
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
                        templateUrl: 'views/pages/user-settings.html'
                    }
                }
            })

            // =========================================================
            // project related routes

            .state('projects', {
                url: '/projects',
                views: {
                    '@': {
                        templateUrl: 'views/pages/projects.html',
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
                        templateUrl: 'views/pages/counters.html',
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
                        templateUrl: 'views/pages/symbols.html'
                    }
                },
                data: {requiresProject: true, roles: ['REGISTERED', 'ADMIN']}
            })
            .state('symbols.trash', {
                url: '/trash',
                views: {
                    '@': {
                        controller: 'SymbolsTrashController',
                        templateUrl: 'views/pages/symbols-trash.html'
                    }
                },
                data: {requiresProject: true, roles: ['REGISTERED', 'ADMIN']}
            })
            .state('symbols.history', {
                url: '/{symbolId:int}/history',
                views: {
                    '@': {
                        controller: 'SymbolsHistoryController',
                        templateUrl: 'views/pages/symbols-history.html'
                    }
                },
                data: {requiresProject: true, roles: ['REGISTERED', 'ADMIN']}
            })
            .state('symbols.actions', {
                url: '/{symbolId:int}/actions',
                views: {
                    '@': {
                        controller: 'SymbolsActionsController',
                        templateUrl: 'views/pages/symbols-actions.html'
                    }
                },
                data: {requiresProject: true, roles: ['REGISTERED', 'ADMIN']}
            })
            .state('symbols.import', {
                url: '/import',
                views: {
                    '@': {
                        controller: 'SymbolsImportController',
                        templateUrl: 'views/pages/symbols-import.html'
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
                        templateUrl: 'views/pages/learn-setup.html'
                    }
                }
            })
            .state('learn.start', {
                url: '/start',
                views: {
                    '@': {
                        controller: 'LearnStartController',
                        templateUrl: 'views/pages/learn-start.html'
                    }
                }
            })
            .state('learn.results', {
                url: '/results',
                views: {
                    '@': {
                        controller: 'LearnResultsController',
                        templateUrl: 'views/pages/learn-results.html'
                    }
                }
            })
            .state('learn.results.statistics', {
                url: '/statistics',
                views: {
                    '@': {
                        controller: 'LearnResultsStatisticsController',
                        templateUrl: 'views/pages/learn-results-statistics.html'
                    }
                }
            })
            .state('learn.results.compare', {
                url: '/compare/:testNos',
                views: {
                    '@': {
                        controller: 'LearnResultsCompareController',
                        templateUrl: 'views/pages/learn-results-compare.html'
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
                        templateUrl: 'views/pages/admin-users.html'
                    }
                }
            })

            // =========================================================
            // other page routes

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
            })
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
                var user = SessionService.user.get();
                var project = SessionService.project.get();

                if ((toState.data.roles && (user === null || toState.data.roles.indexOf(user.role) === -1))
                    || (toState.data.requiresProject && project === null)) {

                    ToastService.danger('You are not allowed to go to this page!');

                    $state.go("home");
                    event.preventDefault();
                }
            }
        }
    }
}());