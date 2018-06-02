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

import {learnAlgorithm} from '../constants';

/**
 * The service to create new eq oracles.
 */
export class LearningAlgorithmService {

    /**
     * Creates an eqOracle from a given type.
     *
     * @param {*} obj - The object to create the eq oracle from.
     * @returns {*}
     */
    create(obj) {
        switch (obj.type) {
            case learnAlgorithm.DHC:
                return {name: learnAlgorithm.DHC};
            case learnAlgorithm.DT:
                return {name: learnAlgorithm.DT};
            case learnAlgorithm.LSTAR:
                return {name: learnAlgorithm.LSTAR};
            case learnAlgorithm.KEARNS_VAZIRANI:
                return {name: learnAlgorithm.KEARNS_VAZIRANI};
            case learnAlgorithm.TTT:
                return {name: learnAlgorithm.TTT};
            default:
                return null;
        }
    }

    /**
     * The type of the eqOracle to create.
     *
     * @param {string} type - The type to create the eq oracle from.
     * @returns {*}
     */
    createFromType(type) {
        return this.create({type: type});
    }
}
