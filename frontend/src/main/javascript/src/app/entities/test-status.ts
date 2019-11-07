/*
 * Copyright 2015 - 2019 TU Dortmund
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

export enum TestReportStatus {
  PENDING = "PENDING",
  IN_PROGRESS = "IN_PROGRESS",
  ABORTED = "ABORTED",
  FINISHED = "FINISHED"
}

export interface TestReport {
  id: number,
  status: TestReportStatus,
  testResults: any[]
}

export interface TestQueueItem {
  report: TestReport,
  config: any,
  results: any
}

export interface TestStatus {
  active: boolean;
  testRunQueue: TestQueueItem[];
  currentTestRun: TestQueueItem;
  currentTest: any;
}
