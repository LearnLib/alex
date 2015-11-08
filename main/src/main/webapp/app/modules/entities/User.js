(function () {
    'use strict';

    angular
        .module('ALEX.entities')
        .factory('User', UserFactory);

    function UserFactory() {

        function User() {

        }

        User.build = function (data) {
            var user = new User();
            user.id = data.id;
            user.role = data.role;
            user.email = data.email;
            return user;
        };

        return User;
    }
}());