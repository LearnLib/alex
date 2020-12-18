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

import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { LearnerResultApiService } from '../../services/api/learner-result-api.service';
import { Project } from '../../entities/project';
import { AppStoreService } from '../../services/app-store.service';
import { LearnerResult } from '../../entities/learner-result';
import { reverse } from 'lodash';

@Component({
  selector: 'model-checking-results-view',
  templateUrl: './model-checking-results-view.component.html'
})
export class ModelCheckingResultsViewComponent implements OnInit {

  learnerResult: LearnerResult;
  sortedSteps: any[] = [];
  collapsedStepsMap = {};

  constructor(private route: ActivatedRoute,
              private learnerResultApi: LearnerResultApiService,
              private appStore: AppStoreService) { }

  ngOnInit(): void {
    this.route.paramMap.subscribe(
      map => this.loadLearnerResult(parseInt(map.get('resultIds')))
    );
  }

  private loadLearnerResult(testNo: number) {
    this.learnerResultApi.get(this.project.id, testNo).subscribe(
      data => {
        this.learnerResult = data;
        this.sortedSteps = reverse(this.learnerResult.steps);
        this.sortedSteps.forEach(s => this.collapsedStepsMap[s.stepNo] = true);
        this.collapsedStepsMap[this.sortedSteps[0].stepNo] = false;

        console.log(this.collapsedStepsMap);
      },
      res => console.error(res.error.message)
    );
  }

  toggle(step: any) {
    Object.keys(this.collapsedStepsMap).forEach(s => this.collapsedStepsMap[s] = true);
    this.collapsedStepsMap[step.stepNo] = false;
  }

  isCollapsed(step: any) {
    return this.collapsedStepsMap[step.stepNo];
  }

  get project(): Project {
    return this.appStore.project;
  }
}
