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

import {ParametrizedSymbol} from './parametrized-symbol';

/**
 * The model for a learner result.
 */
export class LearnResult {

  /** The ID of the learner result. */
  public id: number;

  /** The algorithm that is used. */
  public algorithm: any;

  /** The browser that is used. */
  public driverConfig: any;

  /** The hypothesis. */
  public hypothesis: any;

  /** The project id of the learn result. */
  public project: number;

  /** The id of the reset symbol. */
  public resetSymbol: ParametrizedSymbol;

  /** The id of the post symbol. */
  public postSymbol?: ParametrizedSymbol;

  /** The cumulated statistics. */
  public statistics: any;

  /** The steps of the learn process. */
  public steps: any[];

  /** The input alphabet. */
  public symbols: ParametrizedSymbol[];

  /** The test number. */
  public testNo: number;

  /** If the learner encountered an error. */
  public error: boolean;

  /** The description of the error that occurred. */
  public errorText?: string;

  /** The comment of the learn result. */
  public comment: string;

  /** The list of URLs. */
  public urls: number[];

  /** If membership queries should be cached. */
  public useMQCache: boolean;

  /**
   * Constructor.
   *
   * @param obj The object to create a learn result from.
   */
  constructor(obj: any = {}) {
    this.id = obj.id;
    this.algorithm = obj.algorithm;
    this.driverConfig = obj.driverConfig;
    this.hypothesis = obj.hypothesis;
    this.project = obj.project;
    this.resetSymbol = new ParametrizedSymbol(obj.resetSymbol);
    this.postSymbol = obj.postSymbol != null ? new ParametrizedSymbol(obj.postSymbol) : null;
    this.statistics = obj.statistics;
    this.steps = obj.steps;
    this.symbols = obj.symbols.map(s => new ParametrizedSymbol(s));
    this.testNo = obj.testNo;
    this.error = obj.error;
    this.errorText = obj.errorText;
    this.comment = obj.comment;
    this.urls = obj.urls || [];
    this.useMQCache = obj.useMQCache;

    // convert ns to ms
    LearnResult.convertNsToMs(this.statistics.duration);

    if (this.steps != null && this.steps.length > 0) {
      this.steps.forEach(step => LearnResult.convertNsToMs(step.statistics.duration));
    }
  }

  static convertNsToMs(input: any): void {
    input.total = Math.ceil(input.total / 1000000);
    input.learner = Math.ceil(input.learner / 1000000);
    input.eqOracle = Math.ceil(input.eqOracle / 1000000);
  }

}
