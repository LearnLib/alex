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
 * The service for handling prompt and confirm dialogs.
 */
export class PromptService {

    /**
     * Constructor.
     *
     * @param $uibModal
     */
    // @ngInject
    constructor($uibModal) {
        this.$uibModal = $uibModal;
    }

    /**
     * Opens the prompt dialog.
     *
     * @param {string} text - The text to display.
     * @return {*} - The modal result promise.
     */
    prompt(text) {
        return this.$uibModal.open({
            component: 'promptModal',
            resolve: {
                modalData: function () {
                    return {text: text};
                }
            }
        }).result;
    }

    /**
     * Opens the confirm dialog.
     *
     * @param {string} text - The text to be displayed in the confirm dialog.
     * @returns {*} - The modal result promise.
     */
    confirm(text) {
        return this.$uibModal.open({
            component: 'confirmModal',
            resolve: {
                modalData: function () {
                    return {text: text};
                }
            }
        }).result;
    }
}