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

export const actionFormCall = {
    templateUrl: 'html/components/forms/actions/rest/call.html',
    bindings: {
        action: '='
    },
    controllerAs: 'vm',

    // @ngInject
    controller($http, SessionService) {
        this.project = SessionService.getProject();
        this.cookie = {name: null, value: null};
        this.header = {name: null, value: null};
        this.testResult = null;
        this.error = null;
        this.aceOptions = {
            useWrapMode: true,
            showGutter: true,
            theme: 'eclipse',
            mode: 'json',
            workerPath: '/node_modules/ace-builds/src-min/'
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

            $http.post(`rest/projects/${this.project.id}/symbols/actions/test`, action)
                .then(res => {
                    this.testResult = res.data
                    console.log(res.data)
                })
                .catch(res => this.error = res.data.message)
        }
    }
};

export const actionFormCheckAttributeExists = {
    templateUrl: 'html/components/forms/actions/rest/check-attribute-exists.html',
    bindings: {
        action: '='
    },
    controllerAs: 'vm'
};

export const actionFormCheckAttributeType = {
    templateUrl: 'html/components/forms/actions/rest/check-attribute-type.html',
    bindings: {
        action: '='
    },
    controllerAs: 'vm'
};

export const actionFormCheckAttributeValue = {
    templateUrl: 'html/components/forms/actions/rest/check-attribute-value.html',
    bindings: {
        action: '='
    },
    controllerAs: 'vm'
};

export const actionFormCheckHeaderField = {
    templateUrl: 'html/components/forms/actions/rest/check-header-field.html',
    bindings: {
        action: '='
    },
    controllerAs: 'vm'
};

export const actionFormCheckHttpBody = {
    templateUrl: 'html/components/forms/actions/rest/check-http-body.html',
    bindings: {
        action: '='
    },
    controllerAs: 'vm'
};

export const actionFormCheckStatus = {
    templateUrl: 'html/components/forms/actions/rest/check-status.html',
    bindings: {
        action: '='
    },
    controllerAs: 'vm'
};