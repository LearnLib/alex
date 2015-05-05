(function () {
    'use strict';

    angular
        .module('ALEX', [

            // modules from external libraries
            'ngAnimate',
            'ui.sortable',
            'ui.bootstrap',
            'ui.ace',
            'ui.router',
            'ngToast',
            'n3-line-chart',
            'selectionModel',

            //all templates
            'templates-all',

            // application specific modules
            'ALEX.controller',
            'ALEX.resources',
            'ALEX.directives',
            'ALEX.services',
            'ALEX.filters',
            'ALEX.routes',
            'ALEX.constants',
            'ALEX.models',
            'ALEX.actions',
            'ALEX.dashboard'
        ]);

    angular.module('ALEX.controller', []);
    angular.module('ALEX.resources', []);
    angular.module('ALEX.directives', []);
    angular.module('ALEX.services', []);
    angular.module('ALEX.filters', []);
    angular.module('ALEX.routes', ['ALEX.constants', 'templates-all', 'ui.router']);
    angular.module('ALEX.constants', []);
    angular.module('ALEX.models', []);

    angular.module('ALEX')
        .config(['ngToastProvider', 'selectionModelOptionsProvider',
            function (ngToastProvider, selectionModelOptionsProvider) {

                // configure toast position
                ngToastProvider.configure({
                    verticalPosition: 'top',
                    horizontalPosition: 'center',
                    maxNumber: 1
                });

                // default options for selection model
                selectionModelOptionsProvider.set({
                    selectedAttribute: '_selected',
                    selectedClass: 'selected',
                    type: 'checkbox',
                    mode: 'multiple',
                    cleanupStrategy: 'deselect'
                });
            }])

        .run(['$rootScope', '$state', '_', 'paths',
            function ($rootScope, $state, _, paths) {

                // make some stuff available for use in templates
                $rootScope._ = _;
                $rootScope.paths = paths;

                // workaround for go back in history button since ui.router does not support it
                // save previous state in ui.router $state service
                $rootScope.$on('$stateChangeSuccess', function (event, toState, toParams, fromState) {
                    $state.previous = fromState;
                });
            }])
}());