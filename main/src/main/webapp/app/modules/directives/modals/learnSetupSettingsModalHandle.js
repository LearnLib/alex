/*
 * Copyright 2016 TU Dortmund
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

import {LearnConfiguration} from '../../entities/LearnConfiguration';
import {events, webBrowser, learnAlgorithm, eqOracleType} from '../../constants';

/**
 * The controller for the modal dialog where you can set the settings for an upcoming test run.
 * Passes the edited instance of a LearnConfiguration on success.
 */
// @ngInject
class LearnSetupSettingsModalController {

    /**
     * Constructor
     * @param $uibModalInstance
     * @param modalData
     * @param ToastService
     * @param EventBus
     * @param EqOracleService
     */
    constructor($uibModalInstance, modalData, ToastService, EventBus, EqOracleService) {
        this.$uibModalInstance = $uibModalInstance;
        this.ToastService = ToastService;
        this.EventBus = EventBus;
        this.EqOracleService = EqOracleService;

        /** The constants for eqOracles types */
        this.eqOracles = eqOracleType;

        /**
         * The model for the select input that holds a type for an eqOracle
         * @type {string}
         */
        this.selectedEqOracle = modalData.learnConfiguration.eqOracle.type;

        /**
         * The constants for learnAlgorithm names
         */
        this.learnAlgorithms = learnAlgorithm;

        /**
         * The web driver enum
         */
        this.webBrowser = webBrowser;

        /**
         * The LearnConfiguration to be edited
         * @type {LearnConfiguration}
         */
        this.learnConfiguration = modalData.learnConfiguration;
    }


    /** Sets the Eq Oracle of the learn configuration depending on the selected value */
    setEqOracle() {
        this.learnConfiguration.eqOracle = this.EqOracleService.createFromType(this.selectedEqOracle);
    }

    /** Close the modal dialog and pass the edited learn configuration instance. */
    ok() {
        this.ToastService.success('Learn coniguration updated');
        this.EventBus.emit(events.LEARN_CONFIG_UPDATED, {
            learnConfiguration: this.learnConfiguration
        });
        this.$uibModalInstance.dismiss();
    }

    /** Close the modal dialog. */
    close() {
        this.$uibModalInstance.dismiss();
    }
}


/**
 * The directive that handles the opening of the modal dialog for manipulating a learn configuration. Can only be
 * used as an attribute and attaches a click event to the source element that opens the modal.
 *
 * Attribute 'learnConfiguration' should be the model with a LearnConfiguration object instance.
 *
 * @param $uibModal - The ui.boostrap $modal service
 * @returns {{restrict: string, scope: {learnConfiguration: string}, link: link}}
 */
// @ngInject
function learnSetupSettingsModalHandle($uibModal) {
    return {
        restrict: 'A',
        scope: {
            learnConfiguration: '='
        },
        link: link
    };

    function link(scope, el) {
        el.on('click', () => {
            $uibModal.open({
                templateUrl: 'views/modals/learn-setup-settings-modal.html',
                controller: LearnSetupSettingsModalController,
                controllerAs: 'vm',
                resolve: {
                    modalData: function () {
                        return {
                            learnConfiguration: new LearnConfiguration(scope.learnConfiguration)
                        };
                    }
                }
            });
        });
    }
}

export default learnSetupSettingsModalHandle;