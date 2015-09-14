(function () {
    'use strict';

    angular
        .module('ALEX.core')
        .directive('userLoginForm', userLoginForm);

    userLoginForm.$inject = ['$window', 'paths', 'UserResource', 'jwtHelper'];

    function userLoginForm($window, paths, UserResource, jwtHelper) {
        return {
            scope: true,
            templateUrl: paths.COMPONENTS + '/core/views/directives/user-login-form.html',
            link: link
        };

        function link(scope) {
            scope.user = {};

            scope.login = function () {
                if (scope.user.email && scope.user.password) {
                    UserResource.login(scope.user)
                        .then(function (response) {
                            var token = response.data.token;
                            var tokenPayload = jwtHelper.decodeToken(token);

                            console.log(tokenPayload);

                            $window.sessionStorage.setItem('jwt', token);
                            scope.user = {};
                        })
                }
            }
        }
    }
}());