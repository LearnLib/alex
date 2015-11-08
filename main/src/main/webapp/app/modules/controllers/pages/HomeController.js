(function () {
    'use strict';

    angular
        .module('ALEX.controllers')
        .controller('HomeController', HomeController);

    /**
     * The controller of the index page.
     *
     * @param $state
     * @param SessionService
     * @constructor
     */
    // @ngInject
    function HomeController($state, SessionService) {
        var user = SessionService.user.get();
        var project = SessionService.project.get();

        if (user !== null) {
            if (project !== null) {
                $state.go('dashboard');
            } else {
                $state.go('projects');
            }
        }
    }
}());