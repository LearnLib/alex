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

import { DownloadService } from './download.service';
import { PromptService } from './prompt.service';
import { LearnerResult } from '../entities/learner-result';
import { Injectable } from '@angular/core';

/**
 * The Service that is used to download learn results as csv.
 */
@Injectable()
export class LearnerResultDownloadService {

  constructor(private downloadService: DownloadService,
              private promptService: PromptService) {
  }

  /**
   * Downloads learn results as csv.
   *
   * @param results The learn results to download as csv.
   */
  download(results: LearnerResult[]): Promise<any> {
    let csv = 'Project;Test no;Start time;Step no;Algorithm;Web browser;EQ oracle;|Sigma|;#EQs;'
      + '#MQs (total);#MQs (learner);#MQs (EQ oracle);'
      + '#Symbol calls (total);#Symbol calls (learner);#Symbol calls (EQ oracle);'
      + 'Duration (total); Duration (learner); Duration (EQ oracle)\n';

    results.forEach(result => {
      result.steps.forEach(step => {
        csv += result.project.toString() + ';';
        csv += result.testNo.toString() + ';';
        csv += '"' + step.statistics.startDate + '";';
        csv += step.stepNo.toString() + ';';
        csv += result.setup.algorithm.name + ';';
        csv += result.setup.webDriver.name + ';';
        csv += step.eqOracle.type + ';';
        csv += result.setup.symbols.length.toString() + ';';
        csv += step.statistics.eqsUsed.toString() + ';';
        csv += step.statistics.mqsUsed.total.toString() + ';';
        csv += step.statistics.mqsUsed.learner.toString() + ';';
        csv += step.statistics.mqsUsed.eqOracle.toString() + ';';
        csv += step.statistics.symbolsUsed.total.toString() + ';';
        csv += step.statistics.symbolsUsed.learner.toString() + ';';
        csv += step.statistics.symbolsUsed.eqOracle.toString() + ';';
        csv += step.statistics.duration.total.toString() + ';';
        csv += step.statistics.duration.learner.toString() + ';';
        csv += step.statistics.duration.eqOracle.toString();
        csv += '\n';
      });
      csv += '\n';
    });

    const name = `statistics-${results.map(r => r.testNo).join(',')}`;
    return this.promptService.prompt('Enter a name for the csv file', {defaultValue: name})
      .then(filename => this.downloadService.downloadCsv(csv, filename));
  }
}
