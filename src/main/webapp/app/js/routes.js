(function () {
    'use strict';

    angular
        .module('weblearner')
        .config([
            '$stateProvider', '$urlRouterProvider', 'ngToastProvider',
            config
        ]);

    /**
     * Application routes
     * @param $stateProvider
     * @param $urlRouterProvider
     */
    function config($stateProvider, $urlRouterProvider, ngToastProvider) {

        ngToastProvider.configure({
            verticalPosition: 'top',
            horizontalPosition: 'center',
            maxNumber: 1
        });

        // redirect to the start page when no other route fits
        $urlRouterProvider.otherwise("/home");

        $stateProvider

            // =========================================================
            // index route

            .state('home', {
                url: '/home',
                controller: 'HomeController',
                templateUrl: 'app/partials/home.html'
            })

            // =========================================================
            // project related routes

            .state('project', {
                url: '/project',
                views: {
                    '@': {
                        controller: 'ProjectController',
                        templateUrl: 'app/partials/project.html'
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
                        templateUrl: 'app/partials/project-create.html'
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
                        templateUrl: 'app/partials/project-settings.html',
                        controller: 'ProjectSettingsController'
                    }
                }
            })

            // =========================================================
            // symbol related routes

            .state('symbols', {
                abstract: true,
                url: '/symbols',
                data: {
                    requiresProject: true
                }
            })
            .state('symbols.web', {
                url: '/web',
                views: {
                    '@': {
                        controller: 'SymbolsController',
                        templateUrl: 'app/partials/symbols.html'
                    }
                },
                resolve: {
                    type: function () {
                        return 'web'
                    }
                }
            })
            .state('symbols.web.trash', {
                url: '/trash',
                views: {
                    '@': {
                        controller: 'SymbolsTrashController',
                        templateUrl: 'app/partials/symbols-trash.html'
                    }
                }
            })
            .state('symbols.rest', {
                url: '/rest',
                views: {
                    '@': {
                        controller: 'SymbolsController',
                        templateUrl: 'app/partials/symbols.html'
                    }
                },
                resolve: {
                    type: function () {
                        return 'rest'
                    }
                }
            })
            .state('symbols.rest.trash', {
                url: '/trash',
                views: {
                    '@': {
                        controller: 'SymbolsTrashController',
                        templateUrl: 'app/partials/symbols-trash.html'
                    }
                }
            })
            .state('symbols.actions', {
                url: '/{symbolId:int}/actions',
                views: {
                    '@': {
                        controller: 'SymbolsActionsController',
                        templateUrl: 'app/partials/symbols-actions.html'
                    }
                }

            })
            .state('symbols.import', {
                url: '/import',
                views: {
                    '@': {
                        controller: 'SymbolsImportController',
                        templateUrl: 'app/partials/symbols-import.html'
                    }
                }

            })
            .state('symbols.export', {
                url: '/export',
                views: {
                    '@': {
                        controller: 'SymbolsExportController',
                        templateUrl: 'app/partials/symbols-export.html'
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
                abstract: true,
                url: '/setup'
            })
            .state('learn.setup.web', {
                url: '/web',
                views: {
                    '@': {
                        controller: 'LearnSetupController',
                        templateUrl: 'app/partials/learn-setup.html'
                    }
                },
                resolve: {
                    type: function () {
                        return 'web'
                    }
                }
            })
            .state('learn.setup.rest', {
                url: '/rest',
                views: {
                    '@': {
                        controller: 'LearnSetupController',
                        templateUrl: 'app/partials/learn-setup.html'
                    }
                },
                resolve: {
                    type: function () {
                        return 'rest'
                    }
                }
            })
            .state('learn.start', {
                url: '/start',
                views: {
                    '@': {
                        controller: 'LearnStartController',
                        templateUrl: 'app/partials/learn-start.html'
                    }
                }
            })
            .state('learn.results', {
                url: '/results',
                views: {
                    '@': {
                        controller: 'LearnResultsController',
                        templateUrl: 'app/partials/learn-results.html'
                    }
                }
            })
            .state('learn.results.statistics', {
                url: '/statistics',
                views: {
                    '@': {
                        controller: 'LearnResultsStatisticsController',
                        templateUrl: 'app/partials/learn-results-statistics.html'
                    }
                }
            })
            .state('learn.results.compare', {
                url: '/compare/:testNos',
                views: {
                    '@': {
                        controller: 'LearnResultsCompareController',
                        templateUrl: 'app/partials/learn-results-compare.html'
                    }
                }
            })


            // =========================================================
            // static pages related routes

            .state('about', {
                url: '/about',
                templateUrl: 'app/partials/about.html',
                data: {
                    requiresProject: false
                }
            })
            .state('help', {
                url: '/help',
                templateUrl: 'app/partials/help.html',
                data: {
                    requiresProject: false
                }
            })

            // =========================================================
            // tool pages

            .state('tools', {
                abstract: true,
                template: '<ui-view class="animate-view" />'
            })
            .state('tools.hyotheses', {
                'url': '/tools/hypotheses/view',
                templateUrl: 'app/partials/tools-hypotheses-view.html',
                data: {
                    requiresProject: false
                }
            })
    }

    //////////

    angular.module('weblearner')
        .run([
            '$rootScope', '$state', 'SessionService',
            run
        ]);

    function run($rootScope, $state, SessionService) {

        // route validation
        $rootScope.$on("$stateChangeStart", function (event, toState, toParams, fromState, fromParams) {
            if (toState.data) {
                if (toState.data.requiresProject && SessionService.project.get() == null) {
                    $state.transitionTo("home");
                    event.preventDefault();
                }
            }
        });
    }
}());