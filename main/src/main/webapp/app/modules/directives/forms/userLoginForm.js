import {events} from '../../constants';
import {UserFormModel} from '../../entities/User';

/** The component controller for the user login form */
// @ngInject
class UserLoginForm {

    /**
     * Constructor
     * @param $state
     * @param UserResource
     * @param jwtHelper
     * @param ToastService
     * @param SessionService
     * @param EventBus
     */
    constructor($state, UserResource, jwtHelper, ToastService, SessionService, EventBus) {
        this.$state = $state;
        this.UserResource = UserResource;
        this.jwtHelper = jwtHelper;
        this.ToastService = ToastService;
        this.SessionService = SessionService;
        this.EventBus = EventBus;

        /**
         * The user that wants to login
         * @type {UserFormModel}
         */
        this.user = new UserFormModel();
    }

    login() {
        if (this.user.email && this.user.password) {
            this.UserResource.login(this.user)
                .then(response => {
                    this.ToastService.info('You have logged in!');

                    // decode the token and create a user from it
                    const token = response.data.token;
                    const tokenPayload = this.jwtHelper.decodeToken(token);
                    const user = {
                        id: tokenPayload.userId,
                        role: tokenPayload.userRole
                    };

                    // save the user in the session
                    this.SessionService.saveUser(user, token);

                    this.EventBus.emit(events.USER_LOGGED_IN, {user: user});
                    this.$state.go('projects');
                })
                .catch(() => {
                    this.ToastService.danger('Login failed');
                });
        }
    }
}

const userLoginForm = {
    controller: UserLoginForm,
    controllerAs: 'vm',
    template: `
        <form ng-submit="vm.login()">
            <div class="form-group">
                <label>Email</label>
                <input type="text" class="form-control" placeholder="Email address" autofocus ng-model="vm.user.email">
            </div>
            <div class="form-group">
                <label>Password</label>
                <input type="password" class="form-control" placeholder="Password" ng-model="vm.user.password">
            </div>
            <button class="btn btn-sm btn-block btn-primary">Login</button>
        </form>
    `
};

export default userLoginForm;