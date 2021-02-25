/*
 * Copyright 2015 - 2021 TU Dortmund
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

import { learningAlgorithm } from '../constants';
import { Injectable } from '@angular/core';

/**
 * The service to create new eq oracles.
 */
@Injectable()
export class LearningAlgorithmService {
  private registry = {
    [learningAlgorithm.DHC]: () => ({name: learningAlgorithm.DHC}),
    [learningAlgorithm.DT]: () => ({name: learningAlgorithm.DT}),
    [learningAlgorithm.LSTAR]: () => ({name: learningAlgorithm.LSTAR}),
    [learningAlgorithm.KEARNS_VAZIRANI]: () => ({name: learningAlgorithm.KEARNS_VAZIRANI}),
    [learningAlgorithm.TTT]: () => ({name: learningAlgorithm.TTT})
  };

  /**
   * Creates an eqOracle from a given type.
   *
   * @param data The data to create the algorithm from.
   * @returns The created learning algorithm config object.
   */
  create(data: any): any {
    return this.registry[data.type]();
  }

  /**
   * The type of the eqOracle to create.
   *
   * @param type The type to create the eq oracle from.
   * @returns The created learning algorithm config object.
   */
  createFromType(type: string): any {
    return this.create({type});
  }
}
