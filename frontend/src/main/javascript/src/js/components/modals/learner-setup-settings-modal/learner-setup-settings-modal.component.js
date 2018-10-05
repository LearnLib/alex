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

/**
 * The controller for the modal dialog where you can set the settings for an upcoming test run.
 * Passes the edited instance of a LearnConfiguration on success.
 */
export class LearnerSetupSettingsModalComponent {

    /**
     * Constructor.
     *
     * @param {ToastService} ToastService
     * @param {ProjectService} ProjectService
     * @param {LearningAlgorithmService} LearningAlgorithmService
     */
    // @ngInject
    constructor(ToastService, ProjectService, LearningAlgorithmService) {
        this.ToastService = ToastService;
        this.LearningAlgorithmService = LearningAlgorithmService;
        this.ProjectService = ProjectService;

        /**
         * The LearnConfiguration to be edited.
         * @type {LearnConfiguration}
         */
        this.learnConfiguration = null;

        /**
         * The constants for learnAlgorithm names.
         */
        this.learnAlgorithms = learnAlgorithm;

        /**
         * The constants for learnAlgorithm names.
         */
        this.selectedLearningAlgorithm = null;
    }

    $onInit() {
        this.learnConfiguration = this.resolve.learnConfiguration;
        this.selectedLearningAlgorithm = this.learnConfiguration.algorithm.name;
    }

    /**
     * Sets the Eq Oracle of the learn configuration depending on the selected value.
     */
    setEqOracle(eqOracle) {
        this.learnConfiguration.eqOracle = eqOracle;
    }

    /**
     * Sets the algorithm of the learn configuration depending on the selected value.
     */
    setLearningAlgorithm() {
        this.learnConfiguration.algorithm = this.LearningAlgorithmService.createFromType(this.selectedLearningAlgorithm);
    }

    /**
     * Close the modal dialog and pass the edited learn configuration instance.
     */
    ok() {
        this.ToastService.success('Learn configuration updated');
        this.close({$value: this.learnConfiguration});
    }

    get project() {
        return this.ProjectService.store.currentProject;
    }
}

export const learnerSetupSettingsModalComponent = {
    template: require('./learner-setup-settings-modal.component.html'),
    bindings: {
        close: '&',
        dismiss: '&',
        resolve: '='
    },
    controller: LearnerSetupSettingsModalComponent,
    controllerAs: 'vm',
};
