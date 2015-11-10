(function () {
    'use strict';

    angular
        .module('ALEX.directives')
        .directive('userRegisterForm', userRegisterForm);

    // @ngInject
    function userRegisterForm(UserResource, ToastService, UserFormModel) {
        return {
            scope: true,
            template: `
                <form ng-submit="register()">
                    <div class="form-group">
                        <label>Email</label>
                        <input type="text" class="form-control" placeholder="Email address" ng-model="user.email">
                    </div>
                    <div class="form-group">
                        <label>Password</label>
                        <input type="password" class="form-control" placeholder="Password" ng-model="user.password">
                    </div>
                    <button class="btn btn-sm btn-block btn-primary">Create Account</button>
                </form>
            `,
            link: link
        };

        function link(scope) {
            scope.user = new UserFormModel();

            scope.register = function () {
                if (scope.user.email && scope.user.password) {
                    UserResource.create(scope.user)
                        .then(() => {
                            ToastService.success('Registration successful');
                            scope.user = new UserFormModel();
                        })
                        .catch(response => {
                            ToastService.danger('Registration failed. ' + response.data.message);
                        })
                }
            }
        }
    }
}());