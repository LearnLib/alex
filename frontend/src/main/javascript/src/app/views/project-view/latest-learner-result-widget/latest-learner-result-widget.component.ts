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

import { Component, Input, OnInit } from '@angular/core';
import { Project } from '../../../entities/project';
import { LearnerResult } from '../../../entities/learner-result';
import { LearnerResultApiService } from '../../../services/api/learner-result-api.service';

@Component({
  selector: 'latest-learner-result-widget',
  templateUrl: './latest-learner-result-widget.component.html'
})
export class LatestLearnerResultWidgetComponent implements OnInit {

  @Input()
  public project: Project;

  /** The latest learning result. */
  public result: LearnerResult;

  constructor(private learnerResultApi: LearnerResultApiService) {
  }

  ngOnInit(): void {
    this.learnerResultApi.getLatest(this.project.id).subscribe(
      result => this.result = result,
      console.error
    );
  }
}
