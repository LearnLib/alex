/*
 * Copyright 2018 TU Dortmund
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

/** Component for the testing view. */
export const learnerResultPanelTestingViewComponent = {
    template: require('./learner-result-panel-testing-view.component.html'),
    bindings: {
        registerMenu: '&',
        layoutSettings: '=',
        result: '=',
        pointer: '='
    },
    controllerAs: 'vm',
    controller: class LearnerResultPanelTestingViewComponent {
        $onInit() {
            this.registerMenu({menu: []});
        }
    }
};
