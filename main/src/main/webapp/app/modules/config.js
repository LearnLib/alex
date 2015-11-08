(function () {
    'use strict';

    angular
        .module('ALEX')
        .config(['ngToastProvider', 'selectionModelOptionsProvider', 'jwtInterceptorProvider', '$httpProvider',
            function (ngToastProvider, selectionModelOptionsProvider, jwtInterceptorProvider, $httpProvider) {

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
                    mode: 'multiple',
                    cleanupStrategy: 'deselect'
                });

                // pass the jwt with each request to the server
                jwtInterceptorProvider.tokenGetter = ['$window', function($window) {
                    return $window.sessionStorage.getItem('jwt');
                }];
                $httpProvider.interceptors.push('jwtInterceptor');
            }])

        .run(['$rootScope', '_',
            function ($rootScope, _) {

                // make lodash available for use in templates
                $rootScope._ = _;
            }])
}());