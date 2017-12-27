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

import {events} from '../../constants';

/**
 * The controller that handles the modal dialog for changing the layout settings of a hypothesis.
 */
export class HypothesisLayoutSettingsModalComponent {

    /**
     * Constructor.
     *
     * @param EventBus
     */
    // @ngInject
    constructor(EventBus) {
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
    }

    $onInit() {
        const properties = this.resolve.modalData.layoutSettings;
        this.layoutSettings = properties !== null ? properties : this.defaultLayoutProperties;
    }

    /**
     * Closes the modal window and passes the updated layout settings.
     */
    update() {
        this.EventBus.emit(events.HYPOTHESIS_LAYOUT_UPDATED, {settings: this.layoutSettings});
        this.dismiss();
    }

    /**
     * Sets the layout settings to its default values.
     */
    defaultLayoutSettings() {
        this.layoutSettings = this.defaultLayoutProperties;
    }
}

export const hypothesisLayoutSettingsModalComponent = {
    templateUrl: 'html/components/modals/hypothesis-layout-settings-modal.html',
    bindings: {
        dismiss: '&',
        resolve: '='
    },
    controller: HypothesisLayoutSettingsModalComponent,
    controllerAs: 'vm',
};

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
                    component: 'hypothesisLayoutSettingsModal',
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
