import {User} from '../../entities/User';

/**
 * The directive that opens the modal window for editing a user.
 * The directive should only be used as an attribute.
 *
 * Usage: <a href="" user-edit-modal-handle user="..."></a>
 * where attribute 'user' expects a user object
 *
 * @param $modal
 * @returns {{scope: {user: string}, restrict: string, link: link}}
 */
// @ngInject
function userEditModalHandle($modal) {
    return {
        scope: {
            user: '='
        },
        restrict: 'A',
        link: link
    };

    function link(scope, el) {
        el.on('click', () => {
            $modal.open({
                templateUrl: 'views/modals/user-edit-modal.html',
                controller: 'UserEditModalController',
                controllerAs: 'vm',
                resolve: {
                    modalData: function () {
                        return {user: new User(scope.user)};
                    }
                }
            })
        })
    }
}

export default userEditModalHandle;