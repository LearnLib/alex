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

import { Component, ElementRef, EventEmitter, Input, Output } from '@angular/core';

/**
 * The form that searches for an action based on user input.
 */
@Component({
  selector: 'search-form',
  templateUrl: './search-form.component.html',
  styleUrls: ['./search-form.component.scss']
})
export class SearchFormComponent {

  @Output()
  selected = new EventEmitter<any>();

  @Input()
  placeholder: string;

  @Input()
  itemsFn: () => any[];

  @Input()
  displayFn: (item: any) => any;

  @Input()
  searchFn: (item: any, prop: any) => any;

  /** If the input element has been focused. */
  focused: boolean;

  /** The list of actions that are displayed based on the user input. */
  itemList: any[];

  /** The user input. */
  value: string;

  clickHandler: any;

  constructor(private element: ElementRef) {
    this.focused = false;
    this.itemList = [];
    this.value = '';
    this.clickHandler = this.handleClick.bind(this);
  }

  /**
   * Handles to input focus event.
   */
  handleFocus(e): void {
    if (e.relatedTarget != null) {
      e.preventDefault();
      this.element.nativeElement.querySelector('input').blur();
    } else {
      this.focused = true;
      this.updateItemList();
      document.addEventListener('click', this.clickHandler);
    }
  }

  /**
   * Selects an action and hides the action list.
   *
   * @param item
   */
  selectItem(item: any): void {
    this.reset();
    this.value = '';
    this.selected.emit(item);
  }

  /**
   * Filter the list of actions that is displayed based on the user input.
   * Fires every 500ms.
   */
  updateItemList(): void {
    const items = this.itemsFn();
    this.itemList = items.filter(item => this.searchFn(item, this.value));
  }

  private handleClick(e): void {
    let target = e.target;

    while (target !== document.body) {
      if (target === this.element.nativeElement) {
        return;
      }
      target = target.parentNode;
    }

    document.removeEventListener('click', this.clickHandler);
    this.reset();
  }

  private reset(): void {
    this.focused = false;
    this.itemList = [];
  }
}
