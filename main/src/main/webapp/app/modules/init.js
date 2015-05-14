(function(){
    'use strict';

    angular.module('ALEX', [

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
        'ALEX.core',
        'ALEX.actions',
        'ALEX.dashboard',
        'ALEX.modals'
    ])
}());