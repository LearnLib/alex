/*
 * Copyright 2015 - 2020 TU Dortmund
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

import { Component, Input } from '@angular/core';
import { LearnerResult } from '../../entities/learner-result';

@Component({
  selector: 'model-validation-badge',
  templateUrl: './model-validation-badge.component.html'
})
export class ModelValidationBadgeComponent {

  @Input()
  learnerResult: LearnerResult;

  get hasModelCheckingResults() {
    return this.learnerResult.steps.length > 0
      && this.learnerResult.steps[this.learnerResult.steps.length - 1].modelCheckingResults.length > 0;
  }

  get passed() {
    if (this.learnerResult.steps.length > 0) {
      const mcResults = this.learnerResult.steps[this.learnerResult.steps.length - 1].modelCheckingResults;
      return mcResults.reduce((acc, val) => acc && val.passed, true);
    } else {
      return false;
    }
  }
}
