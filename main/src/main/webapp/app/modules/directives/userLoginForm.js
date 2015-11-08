(function () {
    'use strict';

    angular
        .module('ALEX.directives')
        .directive('userLoginForm', userLoginForm);

    // @ngInject
    function userLoginForm($state, $window, UserResource, jwtHelper, ToastService, SessionService) {
        return {
            scope: true,
            templateUrl: 'views/directives/user-login-form.html',
            link: link
        };

        function link(scope) {
            scope.user = {};

            scope.login = function () {
                if (scope.user.email && scope.user.password) {
                    UserResource.login(scope.user)
                        .then(function (response) {
                            ToastService.info('You have logged in!');

                            var token = response.data.token;
                            var tokenPayload = jwtHelper.decodeToken(token);

                            $window.sessionStorage.setItem('jwt', token);

                            // save user in session
                            SessionService.user.save({
                                id: tokenPayload.userId,
                                role: tokenPayload.userRole
                            });

                            // go to the users project page
                            $state.go('projects');
                        })
                        .catch(function () {
                            ToastService.danger('Login failed');
                        })
                }
            }
        }
    }
}());