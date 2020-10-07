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

import { eqOracleType } from '../constants';
import { CompleteEqOracle } from '../entities/eq-oracles/complete-eq-oracle';
import { HypothesisEqOracle } from '../entities/eq-oracles/hypothesis-eq-oracle';
import { RandomEqOracle } from '../entities/eq-oracles/random-eq-oracle';
import { SampleEqOracle } from '../entities/eq-oracles/sample-eq-oracle';
import { TestSuiteEqOracle } from '../entities/eq-oracles/test-suite-eq-oracle';
import { WMethodEqOracle } from '../entities/eq-oracles/w-method-eq-oracle';
import { WpMethodEqOracle } from '../entities/eq-oracles/wp-method-eq-oracle';
import { EqOracle } from '../entities/eq-oracles/eq-oracle';
import { Injectable } from '@angular/core';

/**
 * The service to create new eq oracles.
 */
@Injectable()
export class EqOracleService {
  private registry = {
    [eqOracleType.RANDOM]: (data) => new RandomEqOracle(data.minLength, data.maxLength, data.maxNoOfTests, data.seed),
    [eqOracleType.COMPLETE]: (data) => new CompleteEqOracle(data.minDepth, data.maxDepth),
    [eqOracleType.SAMPLE]: (data) => new SampleEqOracle(data.counterExamples),
    [eqOracleType.WMETHOD]: (data) => new WMethodEqOracle(data.maxDepth),
    [eqOracleType.HYPOTHESIS]: (data) => new HypothesisEqOracle(data.hypothesis),
    [eqOracleType.TEST_SUITE]: (data) => new TestSuiteEqOracle(data.testSuiteId, data.includeChildTestSuites),
    [eqOracleType.WP_METHOD]: (data) => new WpMethodEqOracle(data.maxDepth)
  };

  /**
   * Creates an eqOracle from a given type.
   *
   * @param data The data to create the eq oracle from.
   * @returns The create equivalence oracle.
   */
  create(data: any): EqOracle {
    return this.registry[data.type](data);
  }

  /**
   * The type of the eqOracle to create.
   *
   * @param type The type to create the eq oracle from.
   * @returns The created oracle.
   */
  createFromType(type: string): EqOracle {
    return this.create({type: type});
  }
}
