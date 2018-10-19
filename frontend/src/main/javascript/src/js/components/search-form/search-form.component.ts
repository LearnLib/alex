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

import {IRootElementService, IScope} from 'angular';

/**
 * The form that searches for an action based on user input.
 */
export const searchFormComponent = {
  template: require('./search-form.component.html'),
  bindings: {
    placeholder: '@',
    itemsFn: '&',
    displayFn: '&',
    searchFn: '&',
    onSelected: '&',
  },
  controllerAs: 'vm',
  controller: class SearchFormComponent {

    public placeholder: string;

    public itemsFn: () => any[];

    public displaFn: () => any;

    public searchFn: () => any;

    onSelected: (any) => void;

    /** If the input element has been focused. */
    public focused: boolean;

    /** The list of actions that are displayed based on the user input. */
    public itemList: any[];

    /** The user input. */
    public value: string;

    public clickHandler: any;

    /**
     * Constructor.
     *
     * @param $scope
     * @param $element
     */
    /* @ngInject */
    constructor(private $element: IRootElementService,
                private $scope: IScope) {

      this.focused = false;
      this.itemList = [];
      this.value = '';
      this.clickHandler = this.handleClick.bind(this);
    }

    /**
     * Handles to input focus event.
     */
    handleFocus(): void {
      this.focused = true;
      this.updateItemList();

      document.addEventListener('click', this.clickHandler);
    }

    /**
     * Selects an action and hides the action list.
     *
     * @param item
     */
    selectItem(item: any): void {
      this.reset();
      this.value = '';
      this.onSelected({item});
    }

    /**
     * Filter the list of actions that is displayed based on the user input.
     * Fires every 500ms.
     */
    updateItemList(): void {
      const items = this.itemsFn();
      this.itemList = items.filter(item => this.searchFn()(item, this.value));
    }

    private handleClick(e): void {
      let target = e.target;
      while (target !== document.body) {
        if (target === this.$element[0]) {
          return;
        }
        target = target.parentNode;
      }

      document.removeEventListener('click', this.clickHandler);
      this.$scope.$apply(() => this.reset());
    }

    private reset(): void {
      this.focused = false;
      this.itemList = [];
    }
  }
};
