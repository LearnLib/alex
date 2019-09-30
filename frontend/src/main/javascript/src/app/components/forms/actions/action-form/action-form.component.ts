/*
 * Copyright 2015 - 2019 TU Dortmund
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

import { AlphabetSymbol } from '../../../../entities/alphabet-symbol';
import { Action } from '../../../../entities/actions/action';

/**
 * The component that displays the action forms.
 *
 * Attribute 'action' should contain the action object.
 * Attribute 'symbols' should contain the list of symbols so that they are available by the action.
 */
export const actionFormComponent = {
  template: require('html-loader!./action-form.component.html'),
  bindings: {
    action: '=',
    symbols: '='
  },
  controllerAs: 'vm',
  controller: class ActionFormComponent {

    /** The action to display. */
    public action: Action;

    /** All symbols. */
    public symbols: AlphabetSymbol[];
  }
};
