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

import { SymbolGroupUtils } from '../../../utils/symbol-group-utils';
import { SymbolGroupApiService } from '../../../services/resources/symbol-group-api.service';
import { LearnResultResource } from '../../../services/resources/learner-result-resource.service';
import { Project } from '../../../entities/project';

/**
 * The directive for the dashboard widget that displays information about the current project.
 */
class ProjectDetailsWidgetComponent {

  public project: Project;

  /** The number of symbol groups of the project. */
  public numberOfGroups: number = null;

  /** The number of visible symbols of the project. */
  public numberOfSymbols: number = null;

  /** The number of persisted test runs in the database. */
  public numberOfTests: number = null;

  /**
   * Constructor.
   *
   * @param symbolGroupApi
   * @param learnResultResource
   */
  /* @ngInject */
  constructor(private symbolGroupApi: SymbolGroupApiService,
              private learnResultResource: LearnResultResource) {
  }

  $onInit(): void {
    this.symbolGroupApi.getAll(this.project.id).subscribe(
      groups => {
        this.numberOfGroups = groups.length;
        this.numberOfSymbols = SymbolGroupUtils.getSymbols(groups).length;
      },
      console.error
    );

    this.learnResultResource.getAll(this.project.id)
      .then(results => {
        this.numberOfTests = results.length;
      })
      .catch(err => console.log(err));
  }
}

export const projectDetailsWidgetComponent = {
  template: require('html-loader!./project-details-widget.component.html'),
  bindings: {
    project: '='
  },
  controller: ProjectDetailsWidgetComponent,
  controllerAs: 'vm'
};
