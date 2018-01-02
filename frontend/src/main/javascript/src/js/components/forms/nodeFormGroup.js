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
 * The node form group component.
 * @type {{templateUrl: string, bindings: {node: string}, controllerAs: string, controller: nodeFormGroup.controller}}
 */
export const nodeFormGroup = {
    templateUrl: 'html/components/forms/node-form-group.html',
    bindings: {
        node: '=',
        label: '@',
        onSelected: '&'
    },
    controllerAs: 'vm',
    controller: class {

        /**
         * Constructor.
         * @param {HtmlElementPickerService} HtmlElementPickerService
         */
        // @ngInject
        constructor(HtmlElementPickerService) {
            this.HtmlElementPickerService = HtmlElementPickerService;
        }

        $onInit() {
            this.label = this.label ? this.label : 'Selector';
        }

        /** Opens the element picker. */
        openPicker() {
            this.HtmlElementPickerService.open()
                .then(data => {
                    this.node.selector = data.node.selector;
                    this.node.type = data.node.type;
                    if (this.onSelected) {
                        this.onSelected({data});
                    }
                });
        }
    }
};
