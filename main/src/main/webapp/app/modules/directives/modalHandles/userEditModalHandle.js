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
            });
        });
    }
}

export default userEditModalHandle;