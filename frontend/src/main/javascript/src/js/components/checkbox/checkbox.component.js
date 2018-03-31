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

export const PROPERTY_NAME = '_selected';

/**
 * The controller of the checkbox.
 * Use: <checkbox model="..."></checkbox> where
 * 'model' should be an object.
 */
class CheckboxComponent {

    /**
     * select the item given via the model attribute.
     */
    toggleSelectItem() {
        if (this.model) {
            this.model[PROPERTY_NAME] = !this.model[PROPERTY_NAME];
        }
    }
}

export const checkboxComponent = {
    bindings: {
        model: '='
    },
    controller: CheckboxComponent,
    controllerAs: 'vm',
    template: require('./checkbox.component.html')
};
