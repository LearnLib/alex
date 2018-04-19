/*
 * Copyright 2018 TU Dortmund
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

export const projectFormUrlGroupsComponent = {
    template: require('./project-form-url-groups.component.html'),
    bindings: {
        project: '='
    },
    controllerAs: 'vm',
    controller: class {
        constructor() {
            this.project = null;
            this.url = null;
            this.urlUnderEdit = null;
            this.urlUnderEditIndex = null;
            this._resetUrl();
        }

        $onInit() {
        }

        addUrl() {
            this.url.url = this.url.url.trim();

            if (this.url.url === ''
                || this.url.url === 'http://'
                || this.url.url === 'https://') {
                return;
            }

            if (this.project.urls.length === 0) {
                this.url.default = true;
            }

            if (this.url.name !== null && this.url.name.trim() === '') {
                this.url.name = null;
            }

            this.project.urls.push(this.url);

            this._resetUrl();
        }

        removeUrl(index) {
            const wasDefaultUrl = this.project.urls[index].default;

            this.project.urls.splice(index, 1);

            if (wasDefaultUrl && this.project.urls.length > 0) {
                this.project.urls[0].default = true;
            }
        }

        changeDefaultUrl(index) {
            const defaultUrl = this.project.urls.find(u => u.default);
            defaultUrl.default = false;

            this.project.urls[index].default = true;
        }

        setUrlUnderEdit(index) {
            this.urlUnderEditIndex = index;
            this.urlUnderEdit = Object.assign({}, this.project.urls[index]);
        }

        updateUrl() {
            this.project.urls[this.urlUnderEditIndex] = this.urlUnderEdit;
            this.cancelUpdate();
        }

        cancelUpdate() {
            this.urlUnderEdit = null;
            this.urlUnderEditIndex = null;
        }

        _resetUrl() {
            this.url = {
                name: null,
                url: 'http://',
                default: false,
            };
        }
    }
};
