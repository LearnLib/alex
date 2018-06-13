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
 * The component of the prompt modal.
 */
export class PromptModalComponent {

    /** Constructor. */
    constructor() {

        /**
         * The model for the input field for the user input.
         * @type {string}
         */
        this.userInput = null;

        /**
         * The text to display.
         * @type {string}
         */
        this.text = null;
    }

    $onInit() {
        this.text = this.resolve.text;
        this.userInput = this.resolve.defaultValue;
    }

    /**
     * Close the modal dialog and pass the user input.
     */
    ok() {
        this.close({$value: this.userInput.trim()});
    }
}

export const promptModalComponent = {
    template: require('./prompt-modal.component.html'),
    bindings: {
        close: '&',
        dismiss: '&',
        resolve: '='
    },
    controller: PromptModalComponent,
    controllerAs: 'vm',
};
