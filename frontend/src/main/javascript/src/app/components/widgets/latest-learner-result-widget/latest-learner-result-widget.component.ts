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

import { LearnerResultApiService } from '../../../services/resources/learner-result-api.service';
import { LearnResult } from '../../../entities/learner-result';
import { Project } from '../../../entities/project';

/**
 * The class for the learn result widget.
 */
class LatestLearnerResultWidgetComponent {

  public project: Project;

  /** The latest learning result. */
  public result: LearnResult = null;

  /**
   * Constructor.
   *
   * @param learnerResultApi
   */
  /* @ngInject */
  constructor(private learnerResultApi: LearnerResultApiService) {
  }

  $onInit(): void {
    this.learnerResultApi.getLatest(this.project.id).subscribe(
      result => this.result = result,
      console.error
    );
  }
}

export const latestLearnerResultWidgetComponent = {
  template: require('html-loader!./latest-learner-result-widget.component.html'),
  bindings: {
    project: '='
  },
  controller: LatestLearnerResultWidgetComponent,
  controllerAs: 'vm'
};
