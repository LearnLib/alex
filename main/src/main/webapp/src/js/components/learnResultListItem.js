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
 * The component that displays a learn result list item
 *
 * Use: <learn-result-list-item result="..."></learn-result-list-item> where
 * 'result' should be a learn result object.
 *
 * Everything that is put between the tags is displayed at the most right.
 */
class LearnResultListItem {
}

export const learnResultListItem = {
    template: `
        <div class="learn-result-list-item">
            <checkbox model="vm.result" class="pull-left" selection-model-ignore></checkbox>
            <div class="learn-result-list-item-content">
                <div class="pull-right" ng-transclude></div>
                <span class="label label-danger pull-right" ng-show="vm.result.error">Failed</span>
                <strong>
                    <a ui-sref="resultsCompare({testNos: [vm.result.testNo]})" ng-if="vm.linkTo === 'hypothesis'">
                        Test No <span ng-bind="vm.result.testNo"></span>
                    </a>
                    <a ui-sref="statisticsCompare({testNos: [vm.result.testNo], mode: 'cumulated'})" ng-if="vm.linkTo === 'statistics'">
                        Test No <span ng-bind="vm.result.testNo"></span>
                    </a>
                </strong>,
                [<span ng-bind="(vm.result.algorithm|formatAlgorithm)"></span>]
                <div class="text-muted">
                    <em>
                        Started: <span ng-bind="(vm.result.statistics.startDate | date : 'EEE, dd.MM.yyyy, HH:mm')"></span>
                    </em>
                </div>
                <div class="comment text-muted" ng-if="vm.result.comment" ng-bind="vm.result.comment"></div>
            </div>
        </div>
    `,
    transclude: true,
    controller: LearnResultListItem,
    controllerAs: 'vm',
    bindings: {
        result: '=',
        linkTo: '@'
    }
};