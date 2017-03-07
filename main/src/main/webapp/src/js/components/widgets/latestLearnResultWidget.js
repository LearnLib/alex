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
        LearnResultResource.getAll(this.project.id)
            .then(results => {
                if (results.length > 0) {
                    this.result = results[results.length - 1];
                }
            })
            .catch(err => console.log(err));
    }
}

export const latestLearnResultWidget = {
    templateUrl: 'html/components/widgets/latest-learn-result-widget.html',
    controller: LatestLearnResultWidget,
    controllerAs: 'vm'
};