(function () {
    'use strict';

    angular
        .module('ALEX.core')
        .directive('userLoginForm', userLoginForm);

    userLoginForm.$inject = ['paths', 'UserResource'];

    function userLoginForm(paths, UserResource) {
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
                            console.log(response);
                            scope.user = {};
                        })
                }
            }
        }
    }
}());