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
 * The component that displays a learn result list item.
 *
 * Use: <learn-result-list-item result="..."></learn-result-list-item> where
 * 'result' should be a learn result object.
 *
 * Everything that is put between the tags is displayed at the most right.
 */
class LearnResultListItem {
}

export const learnResultListItem = {
    templateUrl: 'html/components/learn-result-list-item.html',
    transclude: true,
    controller: LearnResultListItem,
    controllerAs: 'vm',
    bindings: {
        result: '=',
        linkTo: '@'
    }
};