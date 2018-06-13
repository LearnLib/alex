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

export const redirectViewComponent = {
    template: require('./redirect-view.component.html'),
    controller: class {

        /**
         * Constructor.
         *
         * @param $state
         * @param $stateParams
         * @param $location
         * @param {SessionService} SessionService
         */
        // @ngInject
        constructor($state, $stateParams, $location, SessionService) {
            this.$location = $location;

            if ($stateParams.to == null) {
                $state.go('error', {message: 'You did not specify a target URL.'});
                return;
            }

            this.targetUrl = $stateParams.to;

            const matchingStates = $state.get().filter(s => s.$$state().url.exec(this.targetUrl));
            if (matchingStates.length === 0) {
                $state.go('error', {message: 'The URL that you want to go to can not be found.'});
                return;
            }

            const user = SessionService.getUser();
            if (user != null) {
                this.redirect();
            }
        }

        redirect() {
            this.$location.url(this.targetUrl);
        }
    },
    controllerAs: 'vm',
};
