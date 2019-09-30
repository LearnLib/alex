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

import { Selectable } from '../../utils/selectable';

export const selectableCheckboxComponent = {
  template: require('html-loader!./selectable-checkbox.component.html'),
  bindings: {
    item: '=',
    selectable: '=',
    change: '&'
  },
  controllerAs: 'vm',
  controller: class SelectableCheckboxComponent {

    public item: any;
    public selectable: Selectable<any>;
    public change: (any) => void;

    selectItem() {
      this.selectable.toggleSelect(this.item);
      this.change({item: this.item});
    }

    isSelected() {
      return this.selectable.isSelected(this.item);
    }
  }
};
