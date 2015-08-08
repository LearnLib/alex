(function () {
    'use strict';

    angular
        .module('ALEX.core', [])

        .config(['ngToastProvider', 'selectionModelOptionsProvider',
            function (ngToastProvider, selectionModelOptionsProvider) {

                // configure ngToast toast position
                ngToastProvider.configure({
                    verticalPosition: 'bottom',
                    horizontalPosition: 'center',
                    maxNumber: 1,
                    additionalClasses: 'animate-toast'
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

        .run(['$rootScope', '_',
            function ($rootScope, _) {

                // make lodash available for use in templates
                $rootScope._ = _;
            }])
}());