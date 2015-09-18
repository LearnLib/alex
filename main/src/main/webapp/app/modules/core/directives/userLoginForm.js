(function () {
    'use strict';

    angular
        .module('ALEX.core')
        .directive('userLoginForm', userLoginForm);

    userLoginForm.$inject = ['$state', '$window', 'paths', 'UserResource', 'jwtHelper', 'ToastService'];

    function userLoginForm($state, $window, paths, UserResource, jwtHelper, Toast) {
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
                            Toast.info('You have logged in!');

                            var token = response.data.token;
                            var tokenPayload = jwtHelper.decodeToken(token);

                            $window.sessionStorage.setItem('jwt', token);

                            // go to the users project page
                            $state.go('projects');
                        })
                        .catch(function () {
                            Toast.danger('Login failed');
                        })
                }
            }
        }
    }
}());