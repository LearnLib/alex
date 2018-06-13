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

import {eqOracleType} from '../constants';
import {CompleteEqOracle} from '../entities/eq-oracles/complete-eq-oracle';
import {HypothesisEqOracle} from '../entities/eq-oracles/hypothesis-eq-oracle';
import {RandomEqOracle} from '../entities/eq-oracles/random-eq-oracle';
import {SampleEqOracle} from '../entities/eq-oracles/sample-eq-oracle';
import {WMethodEqOracle} from '../entities/eq-oracles/w-method-eq-oracle';

/**
 * The service to create new eq oracles.
 */
export class EqOracleService {

    /**
     * Creates an eqOracle from a given type.
     *
     * @param {*} obj - The object to create the eq oracle from.
     * @returns {*}
     */
    create(obj) {
        switch (obj.type) {
            case eqOracleType.RANDOM:
                return new RandomEqOracle(obj.minLength, obj.maxLength, obj.maxNoOfTests, obj.seed);
            case eqOracleType.COMPLETE:
                return new CompleteEqOracle(obj.minDepth, obj.maxDepth);
            case eqOracleType.SAMPLE:
                return new SampleEqOracle(obj.counterExamples);
            case eqOracleType.WMETHOD:
                return new WMethodEqOracle(obj.maxDepth);
            case eqOracleType.HYPOTHESIS:
                return new HypothesisEqOracle(obj.hypothesis);
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
