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

import { learnAlgorithm } from '../../../constants';
import { LearnConfiguration } from '../../../entities/learner-configuration';
import { ToastService } from '../../../services/toast.service';
import { LearningAlgorithmService } from '../../../services/learning-algorithm.service';
import { Project } from '../../../entities/project';
import { Selectable } from '../../../utils/selectable';
import { ProjectEnvironment } from '../../../entities/project-environment';
import { AppStoreService } from '../../../services/app-store.service';
import { Component, Input, OnInit } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

/**
 * The controller for the modal dialog where you can set the settings for an upcoming test run.
 * Passes the edited instance of a LearnConfiguration on success.
 */
@Component({
  selector: 'learner-settings-modal',
  templateUrl: './learner-settings-modal.component.html'
})
export class LearnerSettingsModalComponent implements OnInit {

  /** The constants for learnAlgorithm names. */
  learnAlgorithms: any = learnAlgorithm;

  /** The configuration. */
  @Input()
  learnConfiguration: LearnConfiguration = null;

  /** The selected learning algorithm. */
  selectedLearningAlgorithm: string = null;

  selectedEnvironments: Selectable<ProjectEnvironment>;

  constructor(private toastService: ToastService,
              private appStore: AppStoreService,
              private learningAlgorithmService: LearningAlgorithmService,
              public modal: NgbActiveModal) {
  }

  get project(): Project {
    return this.appStore.project;
  }

  ngOnInit(): void {
    this.selectedLearningAlgorithm = this.learnConfiguration.algorithm.name;
    this.selectedEnvironments = new Selectable(this.project.environments, 'id');

    if (this.learnConfiguration.environments.length === 0) {
      this.selectedEnvironments.select(this.project.getDefaultEnvironment());
      this.learnConfiguration.environments = this.selectedEnvironments.getSelected();
    } else {
      this.selectedEnvironments.selectMany(this.learnConfiguration.environments);
    }
  }

  /**
   * Sets the Eq Oracle of the learn configuration depending on the selected value.
   */
  setEqOracle(eqOracle: any): void {
    this.learnConfiguration.eqOracle = eqOracle;
  }

  /**
   * Sets the algorithm of the learn configuration depending on the selected value.
   */
  setLearningAlgorithm(): void {
    this.learnConfiguration.algorithm = this.learningAlgorithmService.createFromType(this.selectedLearningAlgorithm);
  }

  /**
   * Close the modal dialog and pass the edited learn configuration instance.
   */
  ok(): void {
    this.learnConfiguration.environments = this.selectedEnvironments.getSelected();
    this.toastService.success('Learn configuration updated');
    this.modal.close(this.learnConfiguration);
  }
}
