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
 * The components of the load screen
 */
// @ngInject
class LoadScreen {

    /**
     * Constructor
     * @param $scope
     * @param $http
     */
    constructor($scope, $http) {

        /**
         * If the load screen is visible or not
         * @type {boolean}
         */
        this.visible = false;

        // watch for pending http requests and make the load screen visible
        $scope.$watch(() => $http.pendingRequests.length > 0, value => {
            this.visible = value ? true : false;
        });

    }
}

// the component definition
const loadScreen = {
    controller: LoadScreen,
    controllerAs: 'vm',
    template: `
        <div id="load-screen" ng-if="vm.visible">
            <i class="fa fa-spin fa-circle-o-notch"></i>
            <strong>Loading...</strong>
        </div>
    `
};

export default loadScreen;