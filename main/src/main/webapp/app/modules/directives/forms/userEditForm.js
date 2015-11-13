/**
 * The directive for the form to edit the password and the email of a user or to delete the user.
 *
 * Use: <user-edit-form user="..."></user-edit-form>
 *
 * Expects attribute 'user' to be a user object from the API
 *
 * @param $state
 * @param SessionService
 * @param ToastService
 * @param UserResource
 * @param PromptService
 * @returns {{scope: {user: string}, templateUrl: string, link: link}}
 */
// @ngInject
function userEditForm($state, SessionService, ToastService, UserResource, PromptService) {
    return {
        scope: {
            user: '='
        },
        templateUrl: 'views/directives/user-edit-form.html',
        link: link
    };

    function link(scope) {
        var user = SessionService.user.get();

        /**
         * The model for the input of the old password
         * @type {string}
         */
        scope.oldPassword = '';

        /**
         * The model for the input of the new password
         * @type {string}
         */
        scope.newPassword = '';

        /**
         * The model for the input of the users mail
         * @type {string}
         */
        scope.email = scope.user.email;

        /**
         * Changes the email of the user
         */
        scope.changeEmail = function () {
            if (scope.email !== '') {
                UserResource.changeEmail(scope.user, scope.email)
                    .then(() => {
                        ToastService.success('The email has been changed');

                        // update the jwt correspondingly
                        user.email = scope.email;
                        SessionService.user.save(user);
                    })
                    .catch(response => {
                        ToastService.danger('The email could not be changed. ' + response.data.message);
                    })
            }
        };

        /**
         * Changes the password of the user
         */
        scope.changePassword = function () {
            if (scope.oldPassword === '' || scope.newPassword === '') {
                ToastService.info('Both passwords have to be entered');
                return
            }

            if (scope.oldPassword === scope.newPassword) {
                ToastService.info('The new password should be different from the old one');
                return;
            }

            UserResource.changePassword(scope.user, scope.oldPassword, scope.newPassword)
                .then(() => {
                    ToastService.success('The password has been changed');
                    scope.oldPassword = '';
                    scope.newPassword = '';
                })
                .catch(response => {
                    ToastService.danger('There has been an error. ' + response.data.message);
                })
        };

        /**
         * Deletes the user, removes the jwt on success and redirects to the index page
         */
        scope.deleteUser = function () {
            PromptService.confirm("Do you really want to delete this profile? All data will be permanently deleted.")
                .then(function () {
                    UserResource.remove(scope.user)
                        .then(() => {
                            ToastService.success("The profile has been deleted");

                            // remove the users jwt so that he cannot do anything after being deleted
                            SessionService.user.remove();
                            $state.go('home');
                        })
                        .catch(response => {
                            ToastService.danger("The profile could not be deleted. " + response.data.message);
                        })
                })
        }
    }
}

export default userEditForm;