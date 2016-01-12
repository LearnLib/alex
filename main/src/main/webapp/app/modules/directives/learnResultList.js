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
 * The directive that displays the learn result list
 * @returns {{transclude: boolean, template: string}}
 */
function learnResultList() {
    return {
        transclude: true,
        template: '<div class="learn-result-list" ng-transclude></div>'
    };
}

/**
 * The directive that displays a learn result list item
 *
 * Use: <learn-result-list-item result="..."></learn-result-list-item> where
 * 'result' should be a learn result object.
 *
 * Everything that is put between the tags is displayed at the most right.
 *
 * @returns {{transclude: boolean, scope: {result: string}, template: string}}
 */
function learnResultListItem() {
    return {
        transclude: true,
        scope: {
            result: '=',
            linkTo: '@'
        },
        template: `
                <div class="learn-result-list-item">
                    <checkbox model="result" class="pull-left" selection-model-ignore></checkbox>
                    <div class="learn-result-list-item-content">
                        <div class="pull-right" ng-transclude></div>
                        <span class="label label-danger pull-right" ng-show="result.error">Failed</span>
                        <strong>
                            <a ui-sref="resultsCompare({testNos: [result.testNo]})" ng-if="linkTo === 'hypothesis'">
                                Test No <span ng-bind="result.testNo"></span>
                            </a>
                            <a ui-sref="statisticsCompare({testNos: [result.testNo], mode: 'cumulated'})" ng-if="linkTo === 'statistics'">
                                Test No <span ng-bind="result.testNo"></span>
                            </a>
                        </strong>,
                        [<span ng-bind="(result.configuration.algorithm|formatAlgorithm)"></span>]
                        <div class="text-muted">
                        <em>
                            Started: <span ng-bind="(result.statistics.startDate | date : 'EEE, dd.MM.yyyy, HH:mm')"></span>
                        </em>
                    </div>
                    <div class="comment text-muted" ng-show="result.configuration.comment"  ng-bind="result.configuration.comment">
                    </div>
                </div>
            </div>
            `
    };
}

export {learnResultList, learnResultListItem};