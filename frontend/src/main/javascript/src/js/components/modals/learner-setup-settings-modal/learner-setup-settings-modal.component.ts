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

import {learnAlgorithm} from '../../../constants';
import {LearnConfiguration} from '../../../entities/learner-configuration';
import {ModalComponent} from '../modal.component';
import {ToastService} from '../../../services/toast.service';
import {ProjectService} from '../../../services/project.service';
import {LearningAlgorithmService} from '../../../services/learning-algorithm.service';
import {Project} from '../../../entities/project';

/**
 * The controller for the modal dialog where you can set the settings for an upcoming test run.
 * Passes the edited instance of a LearnConfiguration on success.
 */
export const learnerSetupSettingsModalComponent = {
  template: require('./learner-setup-settings-modal.component.html'),
  bindings: {
    close: '&',
    dismiss: '&',
    resolve: '='
  },
  controllerAs: 'vm',
  controller: class LearnerSetupSettingsModalComponent extends ModalComponent {

    /** The constants for learnAlgorithm names. */
    public learnAlgorithms: any = learnAlgorithm;

    /** The configuration. */
    public learnConfiguration: LearnConfiguration = null;

    /** The selected learning algorithm. */
    public selectedLearningAlgorithm: string = null;

    /**
     * Constructor.
     *
     * @param toastService
     * @param projectService
     * @param learningAlgorithmService
     */
    /* @ngInject */
    constructor(private toastService: ToastService,
                private projectService: ProjectService,
                private learningAlgorithmService: LearningAlgorithmService) {
      super();
    }

    $onInit() {
      this.learnConfiguration = this.resolve.learnConfiguration;
      this.selectedLearningAlgorithm = this.learnConfiguration.algorithm.name;
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
      this.toastService.success('Learn configuration updated');
      this.close({$value: this.learnConfiguration});
    }

    get project(): Project {
      return this.projectService.store.currentProject;
    }
  }
};
