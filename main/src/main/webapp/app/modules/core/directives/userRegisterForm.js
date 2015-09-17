(function () {
    'use strict';

    angular
        .module('ALEX.core')
        .directive('userRegisterForm', userRegisterForm);

    userRegisterForm.$inject = ['paths', 'UserResource', 'ToastService'];

    function userRegisterForm(paths, UserResource, Toast) {
        return {
            scope: true,
            templateUrl: paths.COMPONENTS + '/core/views/directives/user-register-form.html',
            link: link
        };

        function link(scope) {
            scope.user = {};

            scope.register = function () {
                if (scope.user.email && scope.user.password) {
                    UserResource.create(scope.user)
                        .then(function () {
                            Toast.success('Registration successful');
                            scope.user = {};
                        })
                }
            }
        }
    }
}());