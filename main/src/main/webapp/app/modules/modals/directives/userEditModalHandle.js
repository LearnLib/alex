(function () {
    'use strict';

    angular
        .module('ALEX.modals')
        .directive('userEditModalHandle', userEditModalHandle);

    /**
     * The directive that opens the modal window for editing a user.
     * The directive should only be used as an attribute.
     *
     * Usage: <a href="" user-edit-modal-handle user="..."></a>
     * where attribute 'user' expects a user object
     *
     * @param $modal
     * @param paths
     * @param User
     * @returns {{scope: {user: string}, restrict: string, link: link}}
     */
    function userEditModalHandle($modal, paths, User) {
        return {
            scope: {
                user: '='
            },
            restrict: 'A',
            link: link
        };

        function link(scope, el) {
            el.on('click', function () {
                $modal.open({
                    templateUrl: paths.COMPONENTS + '/modals/views/user-edit-modal.html',
                    controller: 'UserEditModalController',
                    resolve: {
                        modalData: function () {
                            return {user: User.build(scope.user)};
                        }
                    }
                })
            })
        }
    }

    userEditModalHandle.$inject = ['$modal', 'paths', 'User'];
}());