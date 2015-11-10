(function () {
    'use strict';

    angular
        .module('ALEX.directives')
        .directive('userEditModalHandle', userEditModalHandle);

    /**
     * The directive that opens the modal window for editing a user.
     * The directive should only be used as an attribute.
     *
     * Usage: <a href="" user-edit-modal-handle user="..."></a>
     * where attribute 'user' expects a user object
     *
     * @param $modal
     * @param User
     * @returns {{scope: {user: string}, restrict: string, link: link}}
     */
    // @ngInject
    function userEditModalHandle($modal, User) {
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
                    templateUrl: 'views/modals/user-edit-modal.html',
                    controller: 'UserEditModalController',
                    resolve: {
                        modalData: function () {
                            return {user: new User(scope.user)};
                        }
                    }
                })
            })
        }
    }
}());