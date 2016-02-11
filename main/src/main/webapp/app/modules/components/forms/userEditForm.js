/*
 * Copyright 2016 TU Dortmund
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

/**
 * The directive for the form to edit the password and the email of a user or to delete the user.
 *
 * Use: <user-edit-form user="..."></user-edit-form>
 *
 * Expects attribute 'user' to be a user object from the API
 */
// @ngInject
class UserEditForm {

    /**
     * Constructor
     * @param $state
     * @param {SessionService} SessionService
     * @param {ToastService} ToastService
     * @param {UserResource} UserResource
     * @param {PromptService} PromptService
     */
    constructor($state, SessionService, ToastService, UserResource, PromptService) {
        this.$state = $state;
        this.SessionService = SessionService;
        this.ToastService = ToastService;
        this.UserResource = UserResource;
        this.PromptService = PromptService;

        /**
         * The model for the input of the old password
         * @type {string}
         */
        this.oldPassword = '';

        /**
         * The model for the input of the new password
         * @type {string}
         */
        this.newPassword = '';

        /**
         * The model for the input of the users mail
         * @type {string}
         */
        this.email = this.user.email;
    }

    /** Changes the email of the user */
    changeEmail() {
        if (this.email !== '') {
            this.UserResource.changeEmail(this.user, this.email)
                .then(() => {
                    this.ToastService.success('The email has been changed');

                    // update the jwt correspondingly
                    const user = this.SessionService.getUser();
                    user.email = this.email;
                    this.SessionService.saveUser(user);
                })
                .catch(response => {
                    this.ToastService.danger('The email could not be changed. ' + response.data.message);
                });
        }
    }

    /** Changes the password of the user */
    changePassword() {
        if (this.oldPassword === '' || this.newPassword === '') {
            this.ToastService.info('Both passwords have to be entered');
            return;
        }

        if (this.oldPassword === this.newPassword) {
            this.ToastService.info('The new password should be different from the old one');
            return;
        }

        this.UserResource.changePassword(this.user, this.oldPassword, this.newPassword)
            .then(() => {
                this.ToastService.success('The password has been changed');
                this.oldPassword = '';
                this.newPassword = '';
            })
            .catch(response => {
                this.ToastService.danger('There has been an error. ' + response.data.message);
            });
    }

    /** Deletes the user, removes the jwt on success and redirects to the index page */
    deleteUser() {
        this.PromptService.confirm("Do you really want to delete this profile? All data will be permanently deleted.")
            .then(() => {
                this.UserResource.remove(this.user)
                    .then(() => {
                        this.ToastService.success("The profile has been deleted");

                        // remove the users jwt so that he cannot do anything after being deleted
                        this.SessionService.removeUser();
                        this.$state.go('home');
                    })
                    .catch(response => {
                        this.ToastService.danger("The profile could not be deleted. " + response.data.message);
                    });
            });
    }
}

const userEditForm = {
    bindings: {
        user: '='
    },
    controller: UserEditForm,
    controllerAs: 'vm',
    template: `
        <h3>Password</h3>
        <form ng-submit="vm.changePassword()">
            <div class="form-group">
                <label>Old password</label>
                <input class="form-control" type="password" ng-model="vm.oldPassword" placeholder="Enter your old password">
            </div>
            <div class="form-group">
                <label>New password</label>
                <input class="form-control" type="password" ng-model="vm.newPassword" placeholder="Enter your new password">
            </div>
            <button class="btn btn-primary btn-sm">Change password</button>
        </form>
        <hr>

        <h3>Email</h3>
        <form name="vm.mailForm" ng-submit="vm.changeEmail()">
            <div class="form-group">
                <label>Email</label>
                <input class="form-control" name="mail" type="email" ng-model="vm.email" placeholder="Enter an email address" required />
            </div>
            <div class="help-block" ng-messages="vm.mailForm.mail.$error" ng-if="vm.mailForm.mail.$touched">
                <div class="alert alert-danger alert-condensed" ng-message="required">
                    The email is required
                </div>
                <div class="alert alert-danger alert-condensed" ng-message="email">
                    You have to enter a valid email address
                </div>
            </div>
            <button class="btn btn-primary btn-sm">Change Email</button>
        </form>
        <hr>

        <div class="text-right">
            <button class="btn btn-sm btn-default" ng-click="vm.deleteUser()">
                <i class="fa fa-fw fa-trash-o"></i> Delete Profile
            </button>
        </div>
    `
};

export default userEditForm;