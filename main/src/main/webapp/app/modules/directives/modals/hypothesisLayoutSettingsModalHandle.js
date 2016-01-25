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

/** The controller that handles the modal dialog for changing the layout settings of a hypothesis */
// @ngInject
class HypothesisLayoutSettingsController {

    /**
     * Constructor
     * @param $modalInstance
     * @param modalData
     */
    constructor($modalInstance, modalData) {
        this.$modalInstance = $modalInstance;

        /**
         * The default layout settings for a hypothesis
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

    /** Closes the modal window and passes the updated layout settings */
    update() {
        this.$modalInstance.close(this.layoutSettings);
    }

    /** Closes the modal window */
    close() {
        this.$modalInstance.dismiss();
    }

    /** Sets the layout settings to its default values */
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
 * Attribute 'onUpdate' {function} should be a callback function with a single parameter for the settings
 *
 * Use: '<button hypothesis-layout-settings-modal-handle layout-settings="..." on-update="...">Click Me!</button>'
 *
 * @param $modal - The ui.boostrap $modal service
 * @returns {{restrict: string, scope: {layoutSettings: string}, link: link}}
 */
// @ngInject
function hypothesisLayoutSettingsModalHandle($modal) {
    return {
        restrict: 'A',
        scope: {
            layoutSettings: '=',
            onUpdate: '&'
        },
        link: link
    };

    function link(scope, el) {
        el.on('click', () => {
            const modal = $modal.open({
                templateUrl: 'views/modals/hypothesis-layout-settings-modal.html',
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

            modal.result.then(layoutSettings => {
                scope.onUpdate()(layoutSettings);
            });
        });
    }
}

export default hypothesisLayoutSettingsModalHandle;