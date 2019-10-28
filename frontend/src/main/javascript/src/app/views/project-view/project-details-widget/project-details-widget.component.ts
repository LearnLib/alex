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

import { Component, Input, OnInit } from '@angular/core';
import { Project } from '../../../entities/project';
import { SymbolGroupApiService } from '../../../services/api/symbol-group-api.service';
import { LearnerResultApiService } from '../../../services/api/learner-result-api.service';
import { SymbolGroupUtils } from '../../../utils/symbol-group-utils';

@Component({
  selector: 'project-details-widget',
  templateUrl: './project-details-widget.component.html',
  styleUrls: ['./project-details-widget.component.scss']
})
export class ProjectDetailsWidgetComponent implements OnInit {

  @Input()
  project: Project;

  /** The number of symbol groups of the project. */
  numberOfGroups: number = null;

  /** The number of visible symbols of the project. */
  numberOfSymbols: number = null;

  /** The number of persisted test runs in the database. */
  numberOfTests: number = null;

  /**
   * Constructor.
   *
   * @param symbolGroupApi
   * @param learnerResultApi
   */
  constructor(private symbolGroupApi: SymbolGroupApiService,
              private learnerResultApi: LearnerResultApiService) {
  }

  ngOnInit(): void {
    this.symbolGroupApi.getAll(this.project.id).subscribe(
      groups => {
        this.numberOfGroups = groups.length;
        this.numberOfSymbols = SymbolGroupUtils.getSymbols(groups).length;
      },
      console.error
    );

    this.learnerResultApi.getAll(this.project.id).subscribe(
      results => this.numberOfTests = results.length,
      console.error
    );
  }
}
