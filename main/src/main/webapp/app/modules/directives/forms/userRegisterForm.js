import {UserFormModel} from '../../entities/User';

/** The controller for the user register form component */
// @ngInject
class UserRegisterFrom {

    /**
     * Constructor
     * @param UserResource
     * @param ToastService
     */
    constructor(UserResource, ToastService) {
        this.UserResource = UserResource;
        this.ToastService = ToastService;


        /**
         * The user to create
         * @type {UserFormModel}
         */
        this.user = new UserFormModel();
    }

    register() {
        if (this.user.email && this.user.password) {
            this.UserResource.create(this.user)
                .then(() => {
                    this.ToastService.success('Registration successful');
                    this.user = new UserFormModel();
                })
                .catch(response => {
                    this.ToastService.danger(`Registration failed. ${response.data.message}`);
                });
        } else {
            this.ToastService.info('Make sure your inputs are valid.');
        }
    }
}

const userRegisterForm = {
    controller: UserRegisterFrom,
    controllerAs: 'vm',
    template: `
        <form ng-submit="vm.register()">
            <div class="form-group">
                <label>Email</label>
                <input type="text" class="form-control" placeholder="Email address" ng-model="vm.user.email">
            </div>
            <div class="form-group">
                <label>Password</label>
                <input type="password" class="form-control" placeholder="Password" ng-model="vm.user.password">
            </div>
            <button class="btn btn-sm btn-block btn-primary">Create Account</button>
        </form>
    `
};

export default userRegisterForm;