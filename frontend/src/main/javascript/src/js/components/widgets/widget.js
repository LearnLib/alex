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
 * Component for displaying a bootstrap panel with a title and a specific content.
 *
 * Use: <widget title="..."></widget> where
 * 'title' is the text to display in the header of the panel.
 */
class Widget {
}

export const widget = {
    controller: Widget,
    controllerAs: 'vm',
    bindings: {
        title: '@'
    },
    transclude: true,
    template: `
      <div class="panel panel-default">
          <div class="panel-heading" ng-if="vm.title">
            <strong class="text-muted" ng-bind="vm.title"></strong>
          </div>
          <div class="panel-body" ng-transclude></div>
      </div>
   `
};