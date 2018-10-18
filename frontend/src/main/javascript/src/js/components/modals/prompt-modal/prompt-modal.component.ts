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

import {ModalComponent} from '../modal.component';

/**
 * The component of the prompt modal.
 */
export const promptModalComponent = {
  template: require('./prompt-modal.component.html'),
  bindings: {
    close: '&',
    dismiss: '&',
    resolve: '='
  },
  controllerAs: 'vm',
  controller: class PromptModalComponent extends ModalComponent {

    /** The model for the input field for the user input. */
    public userInput: string = null;

    /** The text to display. */
    public text: string = null;

    /** Constructor. */
    constructor() {
      super();
    }

    $onInit(): void {
      this.text = this.resolve.text;
      this.userInput = this.resolve.defaultValue;
    }

    /** Close the modal dialog and pass the user input. */
    ok(): void {
      this.close({$value: this.userInput.trim()});
    }
  },
};
