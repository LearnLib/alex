/*
 * Copyright 2015 - 2022 TU Dortmund
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

import { Action } from '../../../../entities/actions/action';
import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'action-search-form',
  templateUrl: './action-search-form.component.html'
})
export class ActionSearchFormComponent {

  /** What happens if an action from the result list is clicked on. */
  @Output()
  selected = new EventEmitter<any>();

  /** The items in the sidebar. */
  @Input()
  actions: any = [];

  /**
   * Select an action.
   *
   * @param action The action.
   */
  selectAction(action: Action): void {
    this.selected.emit({type: action.type});
  }

  /**
   * Get all actions from the action list.
   *
   * @return The actions.
   */
  getActions(): any {
    return this.actions;
  }

  /**
   * Select if an action should be displayed in the result list.
   *
   * @param action The action.
   * @param value The user input.
   * @return if the action should be displayed as a result.
   */
  filterAction(action, value): boolean {
    return action.text.toLowerCase().indexOf(value.toLowerCase()) !== -1
      || action.type.toLowerCase().indexOf(value.toLowerCase()) !== -1;
  }

  /**
   * What should be displayed in the list.
   *
   * @param action The action.
   * @return The displayed text.
   */
  displayAction(action: any): string {
    return action.text;
  }
}
