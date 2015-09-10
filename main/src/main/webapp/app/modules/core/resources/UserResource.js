(function () {
    'use strict';

    angular
        .module('ALEX.core')
        .factory('UserResource', UserResource);

    UserResource.$inject = ['$http', 'paths'];

    function UserResource($http, paths) {
        var uri = paths.api.URL + '/users';

        return {
            create: create,
            login: login
        };

        function create(user) {
            return $http.post(uri, user);
        }

        function login(user) {
            return $http.post(uri + '/login', user);
        }
    }
}());