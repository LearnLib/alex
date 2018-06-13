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

import {eqOracleType} from '../../../constants';

export const eqOracleFormComponent = {
    template: require('./eq-oracle-form.component.html'),
    bindings: {
        eqOracle: '=',
        form: '=',
        onSelected: '&'
    },
    controllerAs: 'vm',
    controller: class EqOracleFormComponent {

        /**
         * Constructor.
         *
         * @param {EqOracleService} EqOracleService
         */
        // @ngInject
        constructor(EqOracleService) {
            this.eqOracleService = EqOracleService;

            /**
             * The eq oracle types.
             * @type {Object}
             */
            this.types = eqOracleType;

            /**
             * The eq oracle.
             * @type {Object}
             */
            this.eqOracle = null;

            /**
             * The selected eq oracle type.
             * @type {String}
             */
            this.selectedType = null;
        }

        $onInit() {
            if (this.eqOracle != null) {
                this.selectedType = this.eqOracle.type;
            }
        }

        /** Emit the eq oracle that is selected. */
        selectEqOracle() {
            const eqOracle = this.eqOracleService.createFromType(this.selectedType);
            this.onSelected({eqOracle});
        }
    }
};
