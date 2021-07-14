/*
 * Copyright 2018 - 2021 TU Dortmund
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

import chalk from 'chalk';
import dateFormat from 'dateformat';
import * as fs from 'fs';
import {
  CompareCommandOptions,
  LearnCommandOptions,
  PollLearnerResultCommandOptions,
  PollTestReportCommandOptions,
  TestCommandOptions,
  Webhook
} from './types';
import {
  learnerApi,
  learnerResultApi,
  learnerResultStepApi,
  learnerSetupApi,
  projectApi,
  testReportApi,
  testSetupApi
} from './apis';
import { assertStatus, asyncTimeout, randomString } from './utils';

async function deleteProject(projectId: number): Promise<void> {
  const res = await projectApi.delete(projectId);
  await assertStatus(res, 204);
  console.log(chalk.white.dim('The project has been deleted.'));
}

async function getProjectByName(name?: string): Promise<any> {
  const res = await projectApi.getAll();
  await assertStatus(res, 200);
  const projects: Array<any> = await res.json();
  const projectWithName = projects.filter((p: any) => p.name === name)[0];
  if (projectWithName == null) {
    throw `Could not find project by name '${name}'`;
  } else {
    console.log(chalk.white.dim(`Project ${name} has been fetched.`));
    return projectWithName;
  }
}

async function getProjectByFile(project: any): Promise<any> {
  try {
    const projectToImport = project;
    projectToImport.project.name = `alex-cli-${dateFormat(new Date(), 'isoDateTime')}-${randomString(10)}`;
    const res = await projectApi.import(projectToImport);
    await assertStatus(res, 201);
    const importedProject = await res.json();
    console.log(chalk.white.dim(`Project ${importedProject.name} has been imported.`));
    return importedProject;
  } catch (e) {
    throw 'Failed to import project.';
  }
}

function writeToFile(path: string, data: string): void {
  if (fs.existsSync(path)) {
    fs.unlinkSync(path);
  }

  try {
    fs.writeFileSync(path, data);
    console.log(chalk.white.dim(`Wrote data to file ${path}.`));
  } catch (e) {
    console.log(chalk.bgRed(`Failed to write contents to file ${path}.`));
    throw e;
  }
}

function printTestReport(report: any): void {
  report.testResults.forEach((tr: any) => {
    if (tr.passed) {
      console.log(`${chalk.bgGreen('success')} ${tr.test.name}`);
    } else {
      console.log(`${chalk.bgRed('failed')} ${tr.test.name}`);
    }
  });
}

async function pollForTestReport(
  projectId: number,
  reportId: number,
  pollInterval: number,
  timeout: number,
  out?: string
): Promise<void> {
  let report = null;
  let polling = true;
  const startTime = Date.now();
  while (polling) {
    const timeElapsed = Date.now() - startTime;
    if (timeout > -1 && timeElapsed > timeout) {
      throw 'Timeout for test process.';
    }

    console.log(chalk.white.dim(`Waiting for tests to finish... (${Math.floor(timeElapsed / 1000)}s elapsed)`));

    const res1 = await testReportApi.get(projectId, reportId);
    await assertStatus(res1, 200);
    report = await res1.json();

    if (report.status === 'IN_PROGRESS' || report.status === 'PENDING') {
      await asyncTimeout(pollInterval);
    } else {
      polling = false;
    }
  }

  printTestReport(report);

  if (out != null) {
    const res = await testReportApi.get(projectId, reportId, 'junit');
    writeToFile(out, await res.text());
  }

  if (report.passed) {
    console.log(chalk.green(`${report.numTestsPassed}/${report.numTests} tests passed.`));
  } else {
    throw `${report.numTestsFailed}/${report.numTests} tests failed.`;
  }
}

async function startTestingFromSetup(projectId: number, setupName: string, webhook?: Webhook): Promise<any> {
  const res1 = await testSetupApi.getAll(projectId);
  await assertStatus(res1, 200);

  const setups: Array<any> = await res1.json();
  const setupsWithRequiredName = setups.filter((s: any) => s.name === setupName);

  if (setupsWithRequiredName.length === 0) {
    throw `There is no test setup with the name "${setupName}" in the project.`;
  }

  let testOptions = {};
  if (webhook) {
    webhook.events.push('TEST_EXECUTION_FINISHED');
    testOptions = { webhook };
  }

  const res2 = await testSetupApi.execute(projectId, setupsWithRequiredName[0].id, testOptions);
  await assertStatus(res2, 200);

  return res2.json();
}

function assertCheckResults(checkResults: Array<any>): void {
  let passed = true;
  let numFailed = 0;
  for (const cr of checkResults) {
    passed = passed && cr.passed;

    if (cr.passed) {
      console.log(chalk.green(`(✓) ${cr.formula.formula}`));
    } else {
      numFailed++;
      console.log(chalk.red(`(x) ${cr.formula.formula} with prefix: ${cr.prefix} and loop: ${cr.loop}.`));
    }
  }

  if (passed) {
    console.log(chalk.white.dim('All LTL properties hold.'));
  } else {
    throw `${numFailed} LTL properties do${numFailed === 1 ? 'es' : ''} not hold.`;
  }
}

async function pollForLearnerResult(
  projectId: number,
  testNo: number,
  pollInterval: number,
  timeout: number,
  out?: string,
  ltlOut?: string
) {
  let result = null;
  let polling = true;
  const startTime = Date.now();

  while (polling) {
    const timeElapsed = Date.now() - startTime;
    if (timeout > -1 && timeElapsed > timeout) {
      throw 'Timeout for learner process.';
    }

    console.log(chalk.white.dim(`Wait for the learning process to finish... (${Math.floor(timeElapsed / 1000)}s elapsed)`));

    const res2 = await learnerResultApi.get(projectId, testNo);
    await assertStatus(res2, 200);
    result = await res2.json();

    if (!(result.status === 'FINISHED' || result.status === 'ABORTED')) {
      await asyncTimeout(pollInterval);
    } else {
      polling = false;
    }
  }

  console.log(chalk.white.dim('The learning process finished.'));

  if (result.error) {
    throw 'The learning process finished with errors.';
  }

  if (result.steps.length == 0) {
    console.log(chalk.white.dim('No steps have been learned in this learning process.'));
    return;
  }

  // write learned model to a file
  if (out) {
    const model = result.steps[result.steps.length - 1].hypothesis;
    writeToFile(out, JSON.stringify(model));
  }

  // analyze model checking results
  const lastStep = result.steps[result.steps.length - 1];
  if (lastStep.modelCheckingResults.length > 0) {

    // write model checking results to a file
    if (ltlOut) {
      const res = await learnerResultStepApi.getModelCheckingResults(projectId, result.id, lastStep.id, 'junit');
      writeToFile(ltlOut, await res.text());
    }

    assertCheckResults(lastStep.modelCheckingResults);
  }
}

async function startLearningFromSetup(projectId: number, setupName: string, webhook?: Webhook): Promise<any> {
  const res1 = await learnerSetupApi.getAll(projectId);
  await assertStatus(res1, 200);

  const setups = await res1.json();
  const setupsWithRequiredName = setups.filter((s: any) => s.name === setupName);

  if (setupsWithRequiredName.length === 0) {
    throw `There is no learner setup with the name "${setupName}" in the project.`;
  }

  let learnerOptions = {};
  if (webhook) {
    webhook.events.push('LEARNER_FINISHED');
    learnerOptions = { webhook };
  }

  const res2 = await learnerSetupApi.execute(projectId, setupsWithRequiredName[0].id, learnerOptions);
  await assertStatus(res2, 200);

  return res2.json();
}

export async function runTestCommand(options: TestCommandOptions): Promise<void> {
  const project = options.projectFile != null
    ? await getProjectByFile(options.projectFile)
    : await getProjectByName(options.projectName);

  const res = await startTestingFromSetup(project.id, options.setupName, options.callbackUrl);

  if (!options.wait) {
    console.log(chalk.white.dim('Do not wait for tests to finish.'));
    console.log(chalk.white.dim(`reportId: ${res.report.id}`));
    return;
  }

  await pollForTestReport(project.id, res.report.id, 5000, -1, options.out);

  if (options.deleteProject) {
    await deleteProject(project.id);
  }
}

export async function runLearnCommand(options: LearnCommandOptions): Promise<void> {
  const project = options.projectFile != null
    ? await getProjectByFile(options.projectFile)
    : await getProjectByName(options.projectName);

  console.log(chalk.white.dim('Start learning...'));

  // start the learning process
  const result = await startLearningFromSetup(project.id, options.setupName, options.callbackUrl);

  if (!options.wait) {
    console.log(chalk.white.dim('Do not wait for learner process to finish.'));
    console.log(chalk.white.dim(`resultId: ${result.testNo}`));
    return;
  }

  await pollForLearnerResult(project.id, result.testNo, 5000, -1, options.out, options.ltlOut);

  if (options.deleteProject) {
    await deleteProject(project.id);
  }
}

export async function runCompareCommand(options: CompareCommandOptions): Promise<void> {
  console.log(chalk.white.dim('Comparing models...'));

  const res = await learnerApi.calculateSeparatingWord(options.models);
  await assertStatus(res, 200);
  const separatingWord: { input: Array<string>, output: Array<string> } = await res.json();

  if (separatingWord.input.length === 0) {
    console.log(chalk.white.dim('Could not find a difference between both models.'));
  } else {
    console.log(chalk.white.dim(`Found a difference for word ${separatingWord.input}.`));
    if (options.out != null) {
      writeToFile(options.out, JSON.stringify(separatingWord));
    }
  }
}

export async function runPollTestReportCommand(options: PollTestReportCommandOptions): Promise<void> {
  const project = await getProjectByName(options.projectName);
  await pollForTestReport(project.id, options.reportId, 5000, options.timeout, options.out);
}

export async function runPollLearnerResultCommand(options: PollLearnerResultCommandOptions): Promise<void> {
  const project = await getProjectByName(options.projectName);
  await pollForLearnerResult(project.id, options.resultId, 5000, options.timeout, options.out, options.ltlOut);
}
