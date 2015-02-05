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
        $urlRouterProvider.otherwise("/");

        $stateProvider

            // =========================================================
            // index route

            .state('state0', {
                url: '/',
                controller: 'IndexController',
                templateUrl: 'app/partials/index.html',
                data: {
                    requiresProject: false
                }
            })

            // =========================================================
            // project related routes

            .state('state1', {
                url: '/project/create',
                controller: 'ProjectCreateController',
                templateUrl: 'app/partials/project-create.html',
                data: {
                    requiresProject: false
                }
            })
            .state('state2', {
                url: '/project/:projectId',
                controller: 'DashboardController',
                templateUrl: 'app/partials/dashboard.html',
                data: {
                    requiresProject: true
                }
            })
            .state('state3', {
                url: '/project/:projectId/settings',
                templateUrl: 'app/partials/project-settings.html',
                controller: 'ProjectSettingsController',
                data: {
                    requiresProject: true
                }
            })

            // =========================================================
            // editor related routes

            .state('state4', {
                url: '/project/:projectId/editor/symbols/web',
                controller: 'EditorSymbolController',
                templateUrl: 'app/partials/editor-symbols.html',
                data: {
                    requiresProject: true
                },
                resolve: {
                    type: function () {
                        return 'web'
                    }
                }
            })
            .state('state5', {
                url: '/project/:projectId/editor/symbols/rest',
                controller: 'EditorSymbolController',
                templateUrl: 'app/partials/editor-symbols.html',
                data: {
                    requiresProject: true
                },
                resolve: {
                    type: function () {
                        return 'rest'
                    }
                }
            })
            .state('state6', {
                url: '/project/:projectId/editor/actions/:symbolId',
                controller: 'EditorActionController',
                templateUrl: 'app/partials/editor-actions.html',
                data: {
                    requiresProject: true
                }
            })

            // =========================================================
            // test and learn related routes

            .state('state7', {
                url: '/project/:projectId/test/setup/web',
                controller: 'TestSetupController',
                templateUrl: 'app/partials/test-setup.html',
                data: {
                    requiresProject: true
                },
                resolve: {
                    type: function () {
                        return 'web'
                    }
                }
            })
            .state('state71', {
                url: '/project/:projectId/test/setup/rest',
                controller: 'TestSetupController',
                templateUrl: 'app/partials/test-setup.html',
                data: {
                    requiresProject: true
                },
                resolve: {
                    type: function () {
                        return 'rest'
                    }
                }
            })
            .state('state8', {
                url: '/project/:projectId/learn',
                controller: 'LearnController',
                templateUrl: 'app/partials/learn.html',
                data: {
                    requiresProject: true
                }
            })
            .state('state9', {
                url: '/project/:projectId/test/result',
                controller: 'TestResultController',
                templateUrl: 'app/partials/test-result.html',
                data: {
                    requiresProject: true
                }
            })
            .state('state15', {
                url: '/project/:projectId/test/result/:testNo',
                controller: 'HypothesesSlideshowController',
                templateUrl: 'app/partials/hypotheses-slideshow.html',
                data: {
                    requiresProject: true
                }
            })
            .state('state10', {
                url: '/project/:projectId/statistics',
                controller: 'StatisticsController',
                templateUrl: 'app/partials/statistics.html',
                data: {
                    requiresProject: true
                }
            })

            // =========================================================
            // symbol related routes

            .state('state11', {
                url: '/project/:projectId/symbol/upload',
                controller: 'SymbolUploadController',
                templateUrl: 'app/partials/symbol-upload.html',
                data: {
                    requiresProject: true
                }
            })
            .state('state12', {
                url: '/project/:projectId/symbol/export',
                controller: 'SymbolExportController',
                templateUrl: 'app/partials/symbol-export.html',
                data: {
                    requiresProject: true
                }
            })

            // =========================================================
            // static pages related routes

            .state('state13', {
                url: '/about',
                templateUrl: 'app/partials/about.html',
                data: {
                    requiresProject: false
                }
            })
            .state('state14', {
                url: '/help',
                templateUrl: 'app/partials/help.html',
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

    function run ($rootScope, $state, SessionService) {

        // route validation
        $rootScope.$on("$stateChangeStart", function (event, toState, toParams, fromState, fromParams) {
            if (toState.data.requiresProject && SessionService.project.get() == null) {
                $state.transitionTo("state0");
                event.preventDefault();
            }
        });
    }
}());