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

/** The Service that is used to download learn results as csv */
// @ngInject
class LearnerResultDownloadService {

    /**
     * Constructor
     * @param FileDownloadService
     */
    constructor(FileDownloadService) {
        this.FileDownloadService = FileDownloadService;

        /**
         * The CSV data
         * @type {string}
         */
        this.csv = '';
    }

    /** Initialize the header of th csv */
    init() {
        this.csv = 'Project,Test No,Start Time,Step No,Algorithm,Eq Oracle,|Sigma|,#MQs,#EQs,#Symbol Calls,Duration (ms)\n';
    }

    /**
     * Adds a single learn result to the csv data
     * @param {LearnResult} result
     */
    addResult(result) {
        this.csv += result.project + ',';
        this.csv += result.testNo + ',';
        this.csv += '"' + result.statistics.startDate + '",';
        this.csv += result.stepNo + ',';
        this.csv += result.configuration.algorithm + ',';
        this.csv += result.configuration.eqOracle.type + ',';
        this.csv += result.configuration.symbols.length + ',';
        this.csv += result.statistics.mqsUsed + ',';
        this.csv += result.statistics.eqsUsed + ',';
        this.csv += result.statistics.symbolsUsed + ',';
        this.csv += result.statistics.duration + '\n';
    }

    /** Creates an empty row so that multiple test runs can be exported at once */
    addEmptyLine() {
        this.csv += '\n';
    }

    /** Downloads the csv */
    download() {
        this.FileDownloadService.downloadCSV(this.csv);
    }
}

export default LearnerResultDownloadService;