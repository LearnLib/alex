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

import {apiUrl} from '../../../../../../../environments';

/**
 * @type {{templateUrl: string, bindings: {action: string}, controllerAs: string, controller(*, *, *): void}}
 */
export const requestActionFormComponent = {
    template: require('./request-action-form.component.html'),
    bindings: {
        action: '='
    },
    controllerAs: 'vm',

    /**
     * Constructor.
     *
     * @param $http
     * @param {SessionService} SessionService
     */
    // @ngInject
    controller($http, SessionService) {
        this.project = SessionService.getProject();
        this.cookie = {name: null, value: null};
        this.header = {name: null, value: null};
        this.testResult = null;
        this.error = null;
        this.aceOptions = {
            useWrapMode: true,
            showGutter: true
        };

        this.addHeader = function () {
            this.action.addHeader(this.header.name, this.header.value);
            this.cookie.name = null;
            this.cookie.value = null;
        };

        this.addCookie = function () {
            this.action.addCookie(this.cookie.name, this.cookie.value);
            this.header.name = null;
            this.header.value = null;
        };

        this.test = function () {
            this.error = null;
            this.testResult = null;
            const action = angular.copy(this.action);
            delete action._id;

            $http.post(`${apiUrl}/projects/${this.project.id}/symbols/actions/test`, action)
                .then(res => this.testResult = res.data)
                .catch(res => this.error = res.data.message);
        };
    }
};
