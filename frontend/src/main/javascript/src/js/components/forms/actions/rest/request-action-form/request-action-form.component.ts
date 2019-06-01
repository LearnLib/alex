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

import {CallRestAction} from '../../../../../entities/actions/rest/request-action';

const presets = {
  JSON: 'JSON',
  GRAPH_QL: 'GRAPH_QL'
};

/**
 * @type {{templateUrl: string, bindings: {action: string}, controllerAs: string, controller(*, *, *): void}}
 */
export const requestActionFormComponent = {
  template: require('./request-action-form.component.html'),
  bindings: {
    action: '='
  },
  controllerAs: 'vm',
  controller: class RequestActionFormComponent {

    public preset: string;
    public cookie: any;
    public header: any;
    public aceOptions: any;
    public action: CallRestAction;

    /** Constructor. */
    constructor() {
      this.preset = presets.JSON;
      this.cookie = {name: null, value: null};
      this.header = {name: null, value: null};

      this.aceOptions = {
        useWrapMode: true,
        showGutter: true
      };
    }

    $onInit(): void {
      if (this.action.data == null) {
        this.setPreset();
      }
    }

    addHeader(): void {
      this.action.addHeader(this.header.name, this.header.value);
      this.header.name = null;
      this.header.value = null;
    }

    addCookie(): void {
      this.action.addCookie(this.cookie.name, this.cookie.value);
      this.cookie.name = null;
      this.cookie.value = null;
    }

    setPreset(): void {
      switch (this.preset) {
        case presets.JSON:
          this.action.data = '{}';
          break;
        case presets.GRAPH_QL:
          this.action.data = `{\n  "query": "",\n  "variables": {}\n}`;
          break;
        default:
          break;
      }
    }
  }
};
