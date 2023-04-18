/*
 * Copyright 2015 - 2022 TU Dortmund
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

type strategy = 'DISCRIMINATION_TREE' | 'W_METHOD' | 'WP_METHOD';

export interface DifferenceTreeAutomataInput {
  type: 'automata';
  strategy: strategy;
  automaton1: any;
  automaton2: any;
}

export interface DifferenceTreeLearnerResultInput {
  type: 'learnerResults';
  strategy: strategy;
  result1: number;
  step1: number;
  result2: number;
  step2: number;
}
