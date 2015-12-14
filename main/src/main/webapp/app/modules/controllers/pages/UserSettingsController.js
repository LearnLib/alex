/** The controller of the user settings page */
// @ngInject
class UserSettingsController {

    /**
     * Constructor
     * @param UserResource
     * @param SessionService
     * @param ToastService
     */
    constructor(UserResource, SessionService, ToastService) {

        // the user from the jwt
        const user = SessionService.getUser();

        /**
         * The user to edit
         * @type {null|User}
         */
        this.user = null;

        // fetch the user from the api
        UserResource.get(user.id)
            .then(user => {
                this.user = user;
            })
            .catch(response => {
                ToastService.danger(`Loading the user failed. ${response.data.message}`);
            });
    }
}

export default UserSettingsController;