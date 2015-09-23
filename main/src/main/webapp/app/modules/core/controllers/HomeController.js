(function () {
    'use strict';

    angular
        .module('ALEX.core')
        .controller('HomeController', HomeController);

    HomeController.$inject = ['$state', 'SessionService'];

    function HomeController($state, Session) {
        var user = Session.user.get();
        var project = Session.project.get();

        if (user !== null) {
            if (project !== null) {
                $state.go('dashboard');
            } else {
                $state.go('projects');
            }
        }
    }
}());