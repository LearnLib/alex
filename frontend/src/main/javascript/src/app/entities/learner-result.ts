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

import { ParametrizedSymbol } from './parametrized-symbol';
import { ProjectEnvironment } from './project-environment';

export enum LearnerResultStatus {
  PENDING = 'PENDING',
  IN_PROGRESS = 'IN_PROGRESS',
  FINISHED = 'FINISHED',
  ABORTED = 'ABORTED'
}

/**
 * The model for a learner result.
 */
export class LearnerResult {

  /** The ID of the learner result. */
  public id: number;

  /** The algorithm that is used. */
  public algorithm: any;

  /** The browser that is used. */
  public driverConfig: any;

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

  /** The comment of the learn result. */
  public comment: string;

  /** The list of URLs. */
  public environments: ProjectEnvironment[];

  /** If membership queries should be cached. */
  public useMQCache: boolean;

  public maxAmountOfStepsToLearn: number;

  public status: LearnerResultStatus;

  /**
   * Constructor.
   *
   * @param obj The object to create a learn result from.
   */
  constructor(obj: any = {}) {
    this.id = obj.id;
    this.algorithm = obj.algorithm;
    this.driverConfig = obj.driverConfig;
    this.project = obj.project;
    this.resetSymbol = new ParametrizedSymbol(obj.resetSymbol);
    this.postSymbol = obj.postSymbol != null ? new ParametrizedSymbol(obj.postSymbol) : null;
    this.statistics = obj.statistics;
    this.steps = obj.steps;
    this.symbols = obj.symbols.map(s => new ParametrizedSymbol(s));
    this.testNo = obj.testNo;
    this.error = obj.error;
    this.comment = obj.comment;
    this.environments = obj.environments || [];
    this.useMQCache = obj.useMQCache;
    this.maxAmountOfStepsToLearn = obj.maxAmountOfStepsToLearn == null ? -1 : obj.maxAmountOfStepsToLearn;
    this.status = obj.status;
  }
}
