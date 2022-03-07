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

import { LearnerSetup } from './learner-setup';
import {User} from './user';

export enum LearnerResultStatus {
  PENDING = 'PENDING',
  IN_PROGRESS = 'IN_PROGRESS',
  FINISHED = 'FINISHED',
  ABORTED = 'ABORTED',
  FAILED = 'FAILED'
}

/**
 * The model for a learner result.
 */
export class LearnerResult {

  /** The ID of the learner result. */
  id: number;

  /** The project id of the learn result. */
  project: number;

  /** The user who initiated the learning process. */
  executedBy: User;

  /** The cumulated statistics. */
  statistics: any;

  /** The steps of the learn process. */
  steps: any[];

  /** The test number. */
  testNo: number;

  /** If the learner encountered an error. */
  error: boolean;

  /** The comment of the learn result. */
  comment: string;

  status: LearnerResultStatus;

  setup: LearnerSetup;

  /**
   * Constructor.
   *
   * @param obj The object to create a learn result from.
   */
  constructor(obj: any = {}) {
    this.id = obj.id;
    this.project = obj.project;
    this.executedBy = obj.executedBy;
    this.statistics = obj.statistics;
    this.steps = obj.steps;
    this.testNo = obj.testNo;
    this.error = obj.error;
    this.comment = obj.comment;
    this.status = obj.status;
    this.setup = LearnerSetup.fromData(obj.setup);
  }
}
