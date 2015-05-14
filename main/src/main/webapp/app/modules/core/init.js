(function () {
    'use strict';

    angular
        .module('ALEX.core', [])

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

        .run(['$rootScope', '$state', '_',
            function ($rootScope, $state, _) {

                // make some stuff available for use in templates
                $rootScope._ = _;

                // workaround for go back in history button since ui.router does not support it
                // save previous state in ui.router $state service
                $rootScope.$on('$stateChangeSuccess', function (event, toState, toParams, fromState) {
                    $state.previous = fromState;
                });
            }])
}());