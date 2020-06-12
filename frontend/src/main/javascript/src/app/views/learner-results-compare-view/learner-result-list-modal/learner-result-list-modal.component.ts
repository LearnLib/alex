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

import { LearnerResultApiService } from '../../../services/api/learner-result-api.service';
import { ToastService } from '../../../services/toast.service';
import { LearnerResult } from '../../../entities/learner-result';
import { Project } from '../../../entities/project';
import { ProjectApiService } from '../../../services/api/project-api.service';
import { Component, Input } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { orderBy } from 'lodash';

/**
 * The component for the modal that displays a selectable list of results.
 */
@Component({
  selector: 'result-list-modal',
  templateUrl: './learner-result-list-modal.component.html'
})
export class LearnerResultListModalComponent {

  /** The results of the current project. */
  @Input()
  results: LearnerResult[] = [];

  @Input()
  allowForeignProjects = true;

  @Input()
  allowFromFile = true;

  projects: Project[] = [];

  constructor(private projectApi: ProjectApiService,
              private learnerResultApi: LearnerResultApiService,
              private toastService: ToastService,
              public modal: NgbActiveModal) {
    this.projectApi.getAll().subscribe(
      projects => this.projects = projects
    );
  }

  /** Switches the view. */
  switchProject(): void {
    this.results = null;
  }

  /**
   * Selects a project of which the learn results should be displayed.
   *
   * @param project The project to display all results from.
   */
  selectProject(project: Project): void {
    this.learnerResultApi.getAll(project.id).subscribe(
      results => this.results = results,
      console.error
    );
  }

  /**
   * Emits the selected result and closes the modal.
   *
   * @param result The selected result.
   */
  selectResult(result: LearnerResult): void {
    this.modal.close(result);
  }

  /**
   * Loads a hypothesis from a json file.
   *
   * @param hypothesis The hypothesis as string
   */
  loadResultFromFile(hypothesis: string): void {
    try {
      this.modal.close({steps: [{hypothesis: JSON.parse(hypothesis)}]});
    } catch (e) {
      this.toastService.danger('Could not parse the file.');
    }
  }

  get orderedResults(): LearnerResult[] {
    return orderBy(this.results, ['testNo'], ['desc']);
  }
}
