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

import {Selectable} from '../../utils/selectable';

export const selectableCheckboxMultipleComponent = {
  template: require('./selectable-checkbox-multiple.component.html'),
  bindings: {
    items: '=',
    selectable: '='
  },
  controllerAs: 'vm',
  controller: class SelectableCheckboxMultipleComponent {

    public items: any[];

    public selectable: Selectable<any>;

    selectItem(): void {
      if (this.items != null) {
        this.selectable.toggleSelectMany(this.items);
      } else {
        this.selectable.toggleSelectAll();
      }
    }

    isSelected(): boolean {
      if (this.items != null) {
        return this.selectable.isAnySelectedIn(this.items);
      } else {
        return this.selectable.isAnySelected();
      }
    }
  }
};
