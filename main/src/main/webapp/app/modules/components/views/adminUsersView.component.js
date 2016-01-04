import {events} from '../../constants';

/** The controller for the admin users page */
// @ngInject
class AdminUsersViewComponent {

    /**
     * Constructor
     * @param $scope
     * @param UserResource
     * @param EventBus
     * @param ToastService
     */
    constructor($scope, UserResource, EventBus, ToastService) {

        /**
         * All registered users
         * @type {User[]}
         */
        this.users = [];

        // fetch all users from the server
        UserResource.getAll()
            .then(users => {
                this.users = users;
            })
            .catch(response => {
                ToastService.danger(`Loading users failed! ${response.data.message}`);
            });

        // listen on user updated event
        EventBus.on(events.USER_UPDATED, (evt, data) => {
            const user = data.user;
            const i = this.users.findIndex(u => u.id === user.id);
            if (i > -1) this.users[i] = user;
        }, $scope);

        // listen on user deleted event
        EventBus.on(events.USER_DELETED, (evt, data) => {
            const i = this.users.findIndex(u => u.id === data.user.id);
            if (i > -1) this.users.splice(i, 1);
        }, $scope);
    }
}

export const adminUsersViewComponent = {
    controller: AdminUsersViewComponent,
    controllerAs: 'vm',
    templateUrl: 'views/pages/admin-users.html'
};