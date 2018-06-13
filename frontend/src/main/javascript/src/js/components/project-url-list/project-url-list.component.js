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

/**
 * The list for selecting target URLs for learning and testing.
 */
export const projectUrlListComponent = {
    template: require('./project-url-list.component.html'),
    bindings: {
        project: '=',
        listModel: '=',
        multiple: '='
    },
    controllerAs: 'vm',
    controller: class {

        /** Constructor. */
        constructor() {

            /**
             * The current project.
             * @type {Project}
             */
            this.project = null;

            /**
             * The list of url ids.
             * @type {Object[]}
             */
            this.listModel = [];

            /**
             * If multiple URLs can be selected.
             * @type {boolean}
             */
            this.multiple = true;
        }

        $onInit() {
            if (this.listModel.length === 0) {
                this.listModel.push(this.project.getDefaultUrl());
            }
        }

        isSelected(url) {
            return this.listModel.find(u => u.id === url.id) != null;
        }

        /**
         * Select or deselect the URL.
         * @param {object} url The selected URL.
         */
        toggleUrl(url) {
            if (this.multiple) {
                this._toggleUrlMultiple(url);
            } else {
                this._toggleUrlSingle(url);
            }
        }

        _toggleUrlSingle(url) {
            const i = this.listModel.findIndex(u => u.id === url.id);
            if (i === -1) {
                this.listModel = [url];
            }
        }

        _toggleUrlMultiple(url) {
            const i = this.listModel.findIndex(u => u.id === url.id);
            if (i > -1) {
                if (this.listModel.length > 1) {
                    this.listModel.splice(i, 1);
                }
            } else {
                this.listModel.push(url);
            }
        }
    }
};
