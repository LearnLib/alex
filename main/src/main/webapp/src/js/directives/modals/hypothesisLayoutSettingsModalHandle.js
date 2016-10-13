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

import {events} from "../../constants";

/**
 * The controller that handles the modal dialog for changing the layout settings of a hypothesis.
 */
export class HypothesisLayoutSettingsController {

    /**
     * Constructor.
     *
     * @param $uibModalInstance
     * @param modalData
     * @param EventBus
     */
    // @ngInject
    constructor($uibModalInstance, modalData, EventBus) {
        this.$uibModalInstance = $uibModalInstance;
        this.EventBus = EventBus;

        /**
         * The default layout settings for a hypothesis.
         * @type {{nodesep: number, edgesep: number, ranksep: number}}
         */
        this.defaultLayoutProperties = {
            nodesep: 50,
            edgesep: 25,
            ranksep: 50
        };

        this.layoutSettings = {};

        if (modalData.layoutSettings !== null) {
            this.layoutSettings = modalData.layoutSettings;
        } else {
            this.layoutSettings = this.defaultLayoutProperties;
        }
    }

    /**
     * Closes the modal window and passes the updated layout settings.
     */
    update() {
        this.EventBus.emit(events.HYPOTHESIS_LAYOUT_UPDATED, {settings: this.layoutSettings});
        this.close();
    }

    /**
     * Closes the modal window.
     */
    close() {
        this.$uibModalInstance.dismiss();
    }

    /**
     * Sets the layout settings to its default values.
     */
    defaultLayoutSettings() {
        this.layoutSettings = this.defaultLayoutProperties;
    }
}


/**
 * The directive that handles the opening of the modal dialog for layout setting of a hypothesis. Has to be used
 * as attribute. It attaches a click event to its element that opens the modal dialog.
 *
 * The corresponding controller should inject 'modalData' {Object}. It holds a property 'layoutSettings' which
 * contains the layoutSettings model.
 *
 * Attribute 'layoutSettings' {Object} should be the model that is passed to the hypothesis directive.
 *
 * Use: '<button hypothesis-layout-settings-modal-handle layout-settings="...">Click Me!</button>'.
 *
 * @param $uibModal - The ui.boostrap $modal service.
 * @returns {{restrict: string, scope: {layoutSettings: string}, link: Function}}
 */
// @ngInject
export function hypothesisLayoutSettingsModalHandle($uibModal) {
    return {
        restrict: 'A',
        scope: {
            layoutSettings: '='
        },
        link(scope, el) {
            el.on('click', () => {
                $uibModal.open({
                    templateUrl: 'html/directives/modals/hypothesis-layout-settings-modal.html',
                    controller: HypothesisLayoutSettingsController,
                    controllerAs: 'vm',
                    resolve: {
                        modalData: function () {
                            return {
                                layoutSettings: angular.copy(scope.layoutSettings)
                            };
                        }
                    }
                });
            });
        }
    };
}