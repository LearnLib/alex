(function () {
    'use strict';

    angular.module('lodash', [])
        .factory('_', function () {
            return window._;
        });

    angular.module('dagreD3', [])
        .factory('dagreD3', function () {
            return window.dagreD3;
        });

    angular.module('d3', [])
        .factory('d3', function () {
            return window.d3;
        });

    angular.module('graphlib', [])
        .factory('graphlib', function () {
            return window.graphlib;
        });

    angular.module('ALEX', [
        // plain js libraries as modules
        'lodash',
        'dagreD3',
        'd3',
        'graphlib',

        // modules from external libraries
        'ngAnimate',
        'ui.bootstrap',
        'ui.ace',
        'ui.router',
        'ngToast',
        'n3-line-chart',
        'selectionModel',
        'ng-sortable',
        'ngFileUpload',
        'angular-jwt',

        // application specific modules
        'ALEX.templates',
        'ALEX.core',
        'ALEX.actions',
        'ALEX.modals'
    ])
}());