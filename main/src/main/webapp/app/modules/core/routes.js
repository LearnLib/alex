(function () {
    'use strict';

    angular
        .module('ALEX.core')
        .config([
            '$stateProvider', '$urlRouterProvider', 'paths',
            config
        ])
        .run([
            '$rootScope', '$state', 'SessionService',
            run
        ]);

    /**
     * Define application routes
     *
     * @param $stateProvider
     * @param $urlRouterProvider
     * @param paths
     */
    function config($stateProvider, $urlRouterProvider, paths) {

        // redirect to the start page when no other route fits
        $urlRouterProvider.otherwise("/home");

        $stateProvider

            // =========================================================
            // index route

            .state('home', {
                url: '/home',
                controller: 'HomeController',
                templateUrl: paths.COMPONENTS + '/core/views/home.html'
            })

            // =========================================================
            // project related routes

            .state('project', {
                url: '/project',
                views: {
                    '@': {
                        controller: 'ProjectController',
                        templateUrl: paths.COMPONENTS + '/core/views/project.html'
                    }
                },
                data: {
                    requiresProject: true
                }
            })
            .state('project.create', {
                url: '/create',
                views: {
                    '@': {
                        controller: 'ProjectCreateController',
                        templateUrl: paths.COMPONENTS + '/core/views/project-create.html'
                    }
                },
                data: {
                    requiresProject: false
                }
            })
            .state('project.settings', {
                url: '/settings',
                views: {
                    '@': {
                        templateUrl: paths.COMPONENTS + '/core/views/project-settings.html',
                        controller: 'ProjectSettingsController'
                    }
                }
            })

            // =========================================================
            // counter related routes

            .state('counters', {
                url: '/counters',
                views: {
                    '@': {
                        templateUrl:paths.COMPONENTS + '/core/views/counters.html',
                        controller: 'CountersController'
                    }
                },
                data: {
                    requiresProject: false
                }
            })

            // =========================================================
            // symbol related routes

            .state('symbols', {
                url: '/symbols',
                views: {
                    '@': {
                        controller: 'SymbolsController',
                        templateUrl: paths.COMPONENTS + '/core/views/symbols.html'
                    }
                },
                data: {
                    requiresProject: true
                }
            })
            .state('symbols.trash', {
                url: '/trash',
                views: {
                    '@': {
                        controller: 'SymbolsTrashController',
                        templateUrl: paths.COMPONENTS + '/core/views/symbols-trash.html'
                    }
                }
            })
            .state('symbols.history', {
                url: '/{symbolId:int}/history',
                views: {
                    '@': {
                        controller: 'SymbolsHistoryController',
                        templateUrl: paths.COMPONENTS + '/core/views/symbols-history.html'
                    }
                }
            })
            .state('symbols.actions', {
                url: '/{symbolId:int}/actions',
                views: {
                    '@': {
                        controller: 'SymbolsActionsController',
                        templateUrl: paths.COMPONENTS + '/core/views/symbols-actions.html'
                    }
                }

            })
            .state('symbols.import', {
                url: '/import',
                views: {
                    '@': {
                        controller: 'SymbolsImportController',
                        templateUrl: paths.COMPONENTS + '/core/views/symbols-import.html'
                    }
                }

            })
            .state('symbols.export', {
                url: '/export',
                views: {
                    '@': {
                        controller: 'SymbolsExportController',
                        templateUrl: paths.COMPONENTS + '/core/views/symbols-export.html'
                    }
                }
            })

            // =========================================================
            // test and learn related routes

            .state('learn', {
                abstract: true,
                url: '/learn',
                data: {
                    requiresProject: true
                }
            })
            .state('learn.setup', {
                url: '/setup',
                views: {
                    '@': {
                        controller: 'LearnSetupController',
                        templateUrl: paths.COMPONENTS + '/core/views/learn-setup.html'
                    }
                }
            })
            .state('learn.start', {
                url: '/start',
                views: {
                    '@': {
                        controller: 'LearnStartController',
                        templateUrl: paths.COMPONENTS + '/core/views/learn-start.html'
                    }
                }
            })
            .state('learn.results', {
                url: '/results',
                views: {
                    '@': {
                        controller: 'LearnResultsController',
                        templateUrl: paths.COMPONENTS + '/core/views/learn-results.html'
                    }
                }
            })
            .state('learn.results.statistics', {
                url: '/statistics',
                views: {
                    '@': {
                        controller: 'LearnResultsStatisticsController',
                        templateUrl: paths.COMPONENTS + '/core/views/learn-results-statistics.html'
                    }
                }
            })
            .state('learn.results.compare', {
                url: '/compare/:testNos',
                views: {
                    '@': {
                        controller: 'LearnResultsCompareController',
                        templateUrl: paths.COMPONENTS + '/core/views/learn-results-compare.html'
                    }
                }
            })

            // =========================================================
            // static pages related routes

            .state('about', {
                url: '/about',
                templateUrl: paths.COMPONENTS + '/core/views/about.html',
                data: {
                    requiresProject: false
                }
            })
            .state('help', {
                url: '/help',
                templateUrl: paths.COMPONENTS + '/core/views/help.html',
                data: {
                    requiresProject: false
                }
            })

            .state('error', {
                url: '/error',
                controller: 'ErrorController',
                templateUrl: paths.COMPONENTS + '/core/views/error.html'
            })
    }

    /**
     * Validate routes on state change
     *
     * @param $rootScope
     * @param $state
     * @param SessionService
     */
    function run($rootScope, $state, SessionService) {

        // route validation
        $rootScope.$on("$stateChangeStart", stateChangeStart);

        function stateChangeStart(event, toState) {
            if (toState.data) {
                if (toState.data.requiresProject && SessionService.project.get() == null) {
                    $state.go("home");
                    event.preventDefault();
                }
            }
        }
    }
}());