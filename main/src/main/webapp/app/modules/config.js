import _ from 'lodash';

/**
 * Configure some third party libraries and set the http interceptor to send the jwt with each request
 * @param ngToastProvider
 * @param selectionModelOptionsProvider
 * @param jwtInterceptorProvider
 * @param $httpProvider
 */
// @ngInject
function config(ngToastProvider, selectionModelOptionsProvider, jwtInterceptorProvider, $httpProvider) {

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
    jwtInterceptorProvider.tokenGetter = ['$window', function ($window) {
        return $window.sessionStorage.getItem('jwt');
    }];
    $httpProvider.interceptors.push('jwtInterceptor');
}

export const configuration = {
    config: config
};