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
 * The component that is used for the sticky sub navigation that mostly contains call to action buttons for the
 * current view
 *
 * Use: '<action-bar></action-bar>'
 */
// @ngInject
class ActionBar {

    /**
     * Constructor
     * @param $scope
     * @param $window
     * @param $element
     */
    constructor($scope, $window, $element) {
        this.$window = $window;

        /** The document.body */
        this.body = angular.element(document.body);

        /** The root element of the component */
        this.rootEl = angular.element($element.children()[0]);

        /** The scroll handler */
        this.scrollHandler = this.handleResize.bind(this);

        $window.addEventListener('scroll', this.scrollHandler, false);

        $scope.$on('$destroy', () => {
            $window.removeEventListener('scroll', this.scrollHandler, false);
            this.body.removeClass('has-fixed-action-bar');
        });
    }

    /** Depending on the scroll y value, toggles classes for fixing the action bar on the top */
    handleResize() {
        if (this.$window.scrollY >= 42) {
            this.rootEl.addClass('fixed');
            this.body.addClass('has-fixed-action-bar');
        } else {
            this.rootEl.removeClass('fixed');
            this.body.removeClass('has-fixed-action-bar');
        }
    }
}

export const actionBar = {
    controller: ActionBar,
    transclude: true,
    template: `
        <div class="action-bar">
            <div class="alx-container-fluid" ng-transclude></div>
        </div>
    `
};