(function () {
    'use strict';

    angular
        .module('ALEX.core')
        .factory('UserResource', UserResource);

    UserResource.$inject = ['$http', 'paths'];

    function UserResource($http, paths) {
        var uri = paths.api.URL + '/users';

        return {
            getAll: getAll,
            create: create,
            login: login,
            remove: remove,
            update: update
        };

        function getAll() {
            return $http.get(uri)
                .then(function (response) {
                    return response.data;
                })
        }

        function create(user) {
            return $http.post(uri, user);
        }

        function login(user) {
            return $http.post(uri + '/login', user);
        }

        function remove(user) {
            return $http.delete(uri + '/' + user.id, {});
        }

        function update(user) {
            return $http.put(uri, user)
                .then(function (response) {
                    return response.data;
                })
        }
    }
}());