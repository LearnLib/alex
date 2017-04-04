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

import {eqOracleType} from "../../constants";

/**
 * The directive for the widget of the sidebar where learn resume configurations can be edited. Should be included
 * into a <div widget></div> directive for visual appeal.
 *
 * Expects an attribute 'learnConfiguration' attached to the element whose value should be a LearnConfiguration
 * object.
 */
class LearnResumeSettingsWidget {

    /**
     * Constructor.
     *
     * @param {EqOracleService} EqOracleService
     */
    // @ngInject
    constructor(EqOracleService) {
        this.EqOracleService = EqOracleService;

        /**
         * The dictionary for eq oracle types.
         * @type {Object}
         */
        this.eqOracles = eqOracleType;
    }

    $onInit() {

        /**
         * The selected eq oracle type from the select box.
         * @type {string}
         */
        this.selectedEqOracle = this.configuration.eqOracle.type;
    }

    /**
     * Load hypothesis.
     * @param hypothesis
     */
    loadHypothesis(hypothesis) {
        this.configuration.eqOracle.hypothesis = JSON.parse(hypothesis);
    }

    /**
     * Creates a new eq oracle object from the selected type and assigns it to the configuration.
     */
    setEqOracle() {
        this.configuration.eqOracle = this.EqOracleService.createFromType(this.selectedEqOracle);
    }
}

export const learnResumeSettingsWidget = {
    templateUrl: 'html/components/widgets/learn-resume-settings-widget.html',
    bindings: {
        configuration: '=',
        result: '<'
    },
    controller: LearnResumeSettingsWidget,
    controllerAs: 'vm'
};