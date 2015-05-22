(function(){
    'use strict';

    angular.module('ALEX', [

        // modules from external libraries
        'ngAnimate',
        'ui.bootstrap',
        'ui.ace',
        'ui.router',
        'ngToast',
        'n3-line-chart',
        'selectionModel',
        'ng-sortable',

        //all templates
        'templates-all',

        // application specific modules
        'ALEX.core',
        'ALEX.actions',
        'ALEX.dashboard',
        'ALEX.modals'
    ])
}());