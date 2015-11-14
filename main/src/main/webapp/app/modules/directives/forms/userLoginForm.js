import {events} from '../../constants';

// @ngInject
function userLoginForm($state, $window, UserResource, jwtHelper, ToastService, SessionService, UserFormModel,
                       EventBus) {
    return {
        scope: true,
        template: `
                <form ng-submit="login()">
                    <div class="form-group">
                        <label>Email</label>
                            <input type="text" class="form-control" placeholder="Email address" autofocus
                                   ng-model="user.email">
                    </div>
                    <div class="form-group">
                        <label>Password</label>
                        <input type="password" class="form-control" placeholder="Password" ng-model="user.password">
                    </div>
                    <button class="btn btn-sm btn-block btn-primary">Login</button>
                </form>
            `,
        link: link
    };

    function link(scope) {
        scope.user = new UserFormModel();

        scope.login = function () {
            if (scope.user.email && scope.user.password) {
                UserResource.login(scope.user)
                    .then(response => {
                        ToastService.info('You have logged in!');

                        const token = response.data.token;
                        const tokenPayload = jwtHelper.decodeToken(token);
                        const user = {
                            id: tokenPayload.userId,
                            role: tokenPayload.userRole
                        };

                        $window.sessionStorage.setItem('jwt', token);
                        SessionService.user.save(user);

                        EventBus.emit(events.USER_LOGGED_IN, {user: user});
                        $state.go('projects');
                    })
                    .catch(() => {
                        ToastService.danger('Login failed');
                    })
            }
        }
    }
}

export default userLoginForm;