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

import {events} from '../../../constants';

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
    template: require('./hypothesis-layout-settings-modal.component.html'),
    bindings: {
        dismiss: '&',
        resolve: '='
    },
    controller: HypothesisLayoutSettingsModalComponent,
    controllerAs: 'vm',
};
