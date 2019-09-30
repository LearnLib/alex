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

/**
 * The node form group component.
 */
export const nodeFormGroupComponent = {
  template: require('html-loader!./node-form-group.component.html'),
  bindings: {
    node: '=',
    label: '@',
    onSelected: '&'
  },
  controllerAs: 'vm',
  controller: class NodeFormGroupComponent {

    public node: any;

    public label: string;

    public onSelected: (any) => void;

    /**
     * Constructor.
     */
    /* @ngInject */
    constructor() {
    }

    $onInit(): void {
      this.label = this.label != null ? this.label : 'Selector';
    }
  }
};
