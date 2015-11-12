/** The controller of the user settings page */
// @ngInject
class UserSettingsController {

    /**
     * Constructor
     * @param UserResource
     * @param SessionService
     */
    constructor(UserResource, SessionService) {

        // the user from the jwt
        const user = SessionService.user.get();

        /**
         * The user to edit
         * @type {null|User}
         */
        this.user = null;

        // fetch the user from the api
        UserResource.get(user.id).then(user => {
            this.user = user;
        });
    }
}

export default UserSettingsController;