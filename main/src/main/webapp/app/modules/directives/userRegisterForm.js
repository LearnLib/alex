(function () {
    'use strict';

    angular
        .module('ALEX.directives')
        .directive('userRegisterForm', userRegisterForm);

    // @ngInject
    function userRegisterForm(UserResource, ToastService) {
        return {
            scope: true,
            templateUrl: 'views/directives/user-register-form.html',
            link: link
        };

        function link(scope) {
            scope.user = {};

            scope.register = function () {
                if (scope.user.email && scope.user.password) {
                    UserResource.create(scope.user)
                        .then(function () {
                            ToastService.success('Registration successful');
                            scope.user = {};
                        })
                        .catch(function (response) {
                            ToastService.danger('Registration failed. ' + response.data.message);
                        })
                }
            }
        }
    }
}());