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

import { Project } from '../../../../entities/project';

export const reportOutputsColumnComponent = {
  template: require('html-loader!./report-outputs-column.component.html'),
  bindings: {
    project: '<',
    outputs: '<'
  },
  controllerAs: 'vm',
  controller: class ReportOutputsColumnComponent {

    public project: Project;
    public outputs: any[];

    /** If the table is collapsed and only the outputs are displayed. */
    public collapse: boolean;

    /* @ngInject */
    constructor(private $uibModal: any) {
      this.collapse = true;
    }

    toggleCollapse(): void {
      this.collapse = !this.collapse;
    }

    showResultDetails(result: any): void {
      this.$uibModal.open({
        component: 'executionResultModal',
        resolve: {
          result: () => result,
        }
      });
    }
  }
};
