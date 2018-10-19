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

import {SymbolGroupUtils} from '../../../utils/symbol-group-utils';
import {SymbolGroupResource} from '../../../services/resources/symbol-group-resource.service';
import {LearnResultResource} from '../../../services/resources/learner-result-resource.service';
import {Project} from '../../../entities/project';

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
   * @param symbolGroupResource
   * @param learnResultResource
   */
  /* @ngInject */
  constructor(private symbolGroupResource: SymbolGroupResource,
              private learnResultResource: LearnResultResource) {
  }

  $onInit(): void {
    this.symbolGroupResource.getAll(this.project.id, true)
      .then(groups => {
        this.numberOfGroups = groups.length;
        this.numberOfSymbols = SymbolGroupUtils.getSymbols(groups).length;
      })
      .catch(err => console.log(err));

    this.learnResultResource.getAll(this.project.id)
      .then(results => {
        this.numberOfTests = results.length;
      })
      .catch(err => console.log(err));
  }
}

export const projectDetailsWidgetComponent = {
  template: require('./project-details-widget.component.html'),
  bindings: {
    project: '='
  },
  controller: ProjectDetailsWidgetComponent,
  controllerAs: 'vm'
};
