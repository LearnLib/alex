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
 * The controller that is used to display the details of a learn result in a modal dialog. The data that is passed
 * to this controller should be an object with a property 'result' which contains a learn result object. If none is
 * given, nothing will be displayed.
 *
 * @constructor
 */
// @ngInject
class LearnResultDetailsModalController {

    /**
     * Constructor
     * @param $modalInstance
     * @param modalData
     * @param LearnResultResource
     */
    constructor($modalInstance, modalData, LearnResultResource) {
        this.$modalInstance = $modalInstance;

        /**
         * The data of the tabs that are displayed
         * @type {*[]}
         */
        this.tabs = [
            {heading: 'Current', result: modalData.result}
        ];

        if (modalData.result.stepNo > 0) {
            LearnResultResource.getFinal(modalData.result.project, modalData.result.testNo)
                .then(res => {
                    this.tabs.push({
                        heading: 'Cumulated',
                        result: res
                    });
                });
        } else {
            this.tabs[0].heading = 'Cumulated';
        }
    }

    /** Close the modal window  */
    ok() {
        this.$modalInstance.dismiss();
    }
}

export default LearnResultDetailsModalController;