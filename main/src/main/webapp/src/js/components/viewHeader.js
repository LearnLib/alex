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
 * The controller for the view header component that is displayed in almost all views
 * Use it like '<view-heading title="..."> ... </view-heading>' where 'title' should be a string
 */
class ViewHeader {

    /** Constructor */
    constructor() {

        /**
         * The title that is displayed in the header
         * @type {null|string}
         */
        this.title = null;
    }
}

const viewHeader = {
    bindings: {
        title: '@'
    },
    controller: ViewHeader,
    controllerAs: 'vm',
    transclude: true,
    template: `
        <div class="view-header">
            <div class="alx-container-fluid">
                <div class="view-header-title-pre" ng-transclude></div>
                <h2 class="view-header-title" ng-bind="::vm.title"></h2>
            </div>
        </div>
    `
};

export default viewHeader;