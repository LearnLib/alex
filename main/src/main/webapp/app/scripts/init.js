(function () {
    'use strict';

    angular
        .module('weblearner', [

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
            'weblearner.controller',
            'weblearner.resources',
            'weblearner.directives',
            'weblearner.services',
            'weblearner.filters',
            'weblearner.routes',
            'weblearner.constants',
            'weblearner.models'
        ]);

    angular.module('weblearner.controller', []);
    angular.module('weblearner.resources', []);
    angular.module('weblearner.directives', []);
    angular.module('weblearner.services', []);
    angular.module('weblearner.filters', []);
    angular.module('weblearner.routes', ['weblearner.constants', 'templates-all', 'ui.router']);
    angular.module('weblearner.constants', []);
    angular.module('weblearner.models', []);

    angular.module('weblearner')

        // configure toast position
        .config(['ngToastProvider', function (ngToastProvider) {
            ngToastProvider.configure({
                verticalPosition: 'top',
                horizontalPosition: 'center',
                maxNumber: 1
            });
        }])

        .run(['$rootScope', '$state', '_', 'paths', function ($rootScope, $state, _, paths) {

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