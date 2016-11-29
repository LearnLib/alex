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
 * The class for the learn result widget.
 */
class LatestLearnResultWidget {

    /**
     * Constructor.
     *
     * @param {SessionService} SessionService
     * @param {LearnResultResource} LearnResultResource
     */
    // @ngInject
    constructor(SessionService, LearnResultResource) {

        /**
         * The latest learning result.
         * @type {null|LearnResult}
         */
        this.result = null;

        /**
         * The project that is in the session.
         * @type {Project}
         */
        this.project = SessionService.getProject();

        // get the latest learn result
        LearnResultResource.getAll(this.project.id).then(results => {
            if (results.length > 0) {
                this.result = results[results.length - 1];
            }
        });
    }
}

export const latestLearnResultWidget = {
    controller: LatestLearnResultWidget,
    controllerAs: 'vm',
    template: `
        <widget title="Latest learn result">
            <div class="text-muted" ng-if="!vm.result">
                <em>There are no learn results in the database</em>
            </div>
            <div ng-if="vm.result">
                <p>
                    The latest learning process started at
                    <strong ng-bind="::(vm.result.statistics.startDate | date : 'EEE, dd.MM.yyyy, HH:mm')"></strong> with EQ-oracle
                    <strong ng-bind="::(vm.result.configuration.eqOracle.type | formatEqOracle)"></strong> and the
                    <strong ng-bind="::(vm.result.configuration.algorithm | formatAlgorithm)"></strong> algorithm.
                </p>
                <a class="btn btn-xs btn-default" ui-sref="resultsCompare({testNos: [vm.result.testNo]})">
                    <i class="fa fa-fw fa-eye"></i> View hypothesis
                </a>
                <a class="btn btn-xs btn-default" ui-sref="statisticsCompare({testNos: [vm.result.testNo]})">
                    <i class="fa fa-fw fa-bar-chart-o"></i> View statistics
                </a>
            </div>
        </widget>
    `
};