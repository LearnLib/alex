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
                templateUrl: 'app/partials/home.html',
                data: {
                    requiresProject: false
                }
            })

            // =========================================================
            // project related routes

            .state('project', {
                url: '/project',
                controller: 'ProjectController',
                templateUrl: 'app/partials/project.html',
                data: {
                    requiresProject: true
                }
            })
	            .state('project.create', {
	                url: '/create',
	                controller: 'ProjectCreateController',
	                templateUrl: 'app/partials/project-create.html',
	                data: {
	                    requiresProject: false
	                }
	            })
	            .state('project.settings', {
	                url: '/settings',
	                templateUrl: 'app/partials/project-settings.html',
	                controller: 'ProjectSettingsController',
	                data: {
	                    requiresProject: true
	                }
	            })

            // =========================================================
            // symbol related routes

            .state('symbols', {
            	abstract: true,
            	url: '/symbols',
            	template: '<ui-view class="animate-view" />'
            })
	            .state('symbols.web', {
	                url: '/web',
	                controller: 'SymbolsController',
	                templateUrl: 'app/partials/symbols.html',
	                data: {
	                    requiresProject: true
	                },
	                resolve: {
	                    type: function () {
	                        return 'web'
	                    }
	                }
	            })
	            .state('symbols.rest', {
	                url: '/rest',
	                controller: 'SymbolsController',
	                templateUrl: 'app/partials/symbols.html',
	                data: {
	                    requiresProject: true
	                },
	                resolve: {
	                    type: function () {
	                        return 'rest'
	                    }
	                }
	            })
	            .state('symbols.actions', {
	            	url: '/{symbolId:int}/actions',
	                controller: 'SymbolsActionsController',
	                templateUrl: 'app/partials/symbols-actions.html',
	                data: {
	                    requiresProject: true
	                }
	            })
	            .state('symbols.import', {
	            	url: '/import',
	                controller: 'SymbolsImportController',
	                templateUrl: 'app/partials/symbols-import.html',
	                data: {
	                    requiresProject: true
	                }
	            })
	            .state('symbols.export', {
	            	url: '/export',
	                controller: 'SymbolsExportController',
	                templateUrl: 'app/partials/symbols-export.html',
	                data: {
	                    requiresProject: true
	                }
	            })

            // =========================================================
            // test and learn related routes
            
            .state('learn', {
	            abstract: true,
	        	url: '/learn',
	        	template: '<ui-view class="animate-view" />'
            })
	            .state('learn.setup', {
	            	abstract: true,
	            	url: '/setup',
	            	template: '<ui-view class="animate-view" />'
	            })
		            .state('learn.setup.web', {
		            	url: '/web',
		                controller: 'LearnSetupController',
		                templateUrl: 'app/partials/learn-setup.html',
		                data: {
		                    requiresProject: true
		                },
		                resolve: {
		                    type: function () {
		                        return 'web'
		                    }
		                }
		            })
		            .state('learn.setup.rest', {
		            	url: '/rest',
		                controller: 'LearnSetupController',
		                templateUrl: 'app/partials/learn-setup.html',
		                data: {
		                    requiresProject: true
		                },
		                resolve: {
		                    type: function () {
		                        return 'rest'
		                    }
		                }
		            })
	            .state('learn.start', {
	            	url: '/start',
	            	controller: 'LearnStartController',
	            	templateUrl: 'app/partials/learn-start.html',
	            	data: {
	                    requiresProject: true
	                }
	            })
	            .state('learn.results', {
	            	url: '/results',
	            	controller: 'LearnResultsController',
	            	templateUrl: 'app/partials/learn-results.html',
	            	data: {
	                    requiresProject: true
	                }
	            })
		            .state('learn.results.statistics', {
		            	url: '/statistics',
		            	controller: 'LearnResultsStatisticsController',
		            	templateUrl: 'app/partials/learn-results-statistics.html',
		            	data: {
		                    requiresProject: true
		                }
		            })
		            .state('learn.results.compare', {
		            	url: '/compare/:testNos',
		            	controller: 'LearnResultsCompareController',
		            	templateUrl: 'app/partials/learn-results-compare.html',
		            	data: {
		                    requiresProject: true
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

    function run ($rootScope, $state, SessionService) {

        // route validation
        $rootScope.$on("$stateChangeStart", function (event, toState, toParams, fromState, fromParams) {        	
            if (toState.data.requiresProject && SessionService.project.get() == null) {
                $state.transitionTo("home");
                event.preventDefault();
            }
        });
    }
}());