/*
 * Copyright 2016 TU Dortmund
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

/**
 * The Service that is used to download learn results as csv.
 */
export class LearnerResultDownloadService {

    /**
     * Constructor.
     *
     * @param {DownloadService} DownloadService
     * @param {PromptService} PromptService
     */
    // @ngInject
    constructor(DownloadService, PromptService) {
        this.DownloadService = DownloadService;
        this.PromptService = PromptService;
    }

    /**
     * Downloads learn results as csv.
     *
     * @param {LearnResult[]} results - The learn results to download as csv.
     */
    download(results) {
        let csv = 'Project;Test no;Start time;Step no;Algorithm;EQ oracle;|Sigma|;#EQs;'
            + '#MQs (total);#MQs (learner);#MQs (EQ oracle);'
            + '#Symbol calls (total);#Symbol calls (learner);#Symbol calls (EQ oracle);'
            + 'Duration (total); Duration (learner); Duration (EQ oracle)\n';

        results.forEach(result => {
            result.steps.forEach(step => {
                csv += result.project.toString() + ';';
                csv += result.testNo.toString() + ';';
                csv += '"' + step.statistics.startDate + '";';
                csv += step.stepNo.toString() + ';';
                csv += result.algorithm.name + ';';
                csv += step.eqOracle.type + ';';
                csv += result.symbols.length.toString() + ';';
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

        return this.PromptService.prompt('Enter a name for the csv file')
            .then(filename => this.DownloadService.downloadCsv(csv, filename));
    }
}