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
            'draganddrop',

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
        .config(['ngToastProvider', function (ngToastProvider) {
            ngToastProvider.configure({
                verticalPosition: 'top',
                horizontalPosition: 'center',
                maxNumber: 1
            });
        }])
        .run(['$rootScope', '_', 'SelectionService', function ($rootScope, _, SelectionService) {
            $rootScope._ = _;
            $rootScope.selection = SelectionService;
        }])
}());