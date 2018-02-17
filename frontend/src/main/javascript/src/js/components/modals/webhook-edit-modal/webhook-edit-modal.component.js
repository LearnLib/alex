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

export const webhookEditModalComponent = {
    template: require('./webhook-edit-modal.component.html'),
    bindings: {
        dismiss: '&',
        close: '&',
        resolve: '='
    },
    controllerAs: 'vm',
    controller: class WebhookEditModalComponent {

        /**
         * Constructor.
         *
         * @param {WebhookResource} WebhookResource
         * @param {ToastService} ToastService
         */
        // @ngInject
        constructor(WebhookResource, ToastService) {
            this.webhookResource = WebhookResource;
            this.toastService = ToastService;

            /**
             * The error message
             * @type {string}
             */
            this.errorMessage = null;

            /**
             * The list of available events.
             * @type {string[]}
             */
            this.events = [];

            /**
             * The selected event.
             * @type {string}
             */
            this.selectedEvent = null;
        }

        $onInit() {
            this.webhook = this.resolve.modalData.webhook;

            this.webhookResource.getEvents()
                .then((events) => this.events = events)
                .catch(console.error);
        }

        /** Updates the webhook. */
        updateWebhook() {
            this.errorMessage = null;

            if (this.webhook.events.length === 0) {
                this.errorMessage = 'You have to subscribe to at least one event.';
                return;
            }

            this.webhookResource.update(this.webhook)
                .then((webhook) => {
                    this.toastService.success('The webhook has been updated.');
                    this.close({$value: webhook});
                })
                .catch((error) => {
                    this.errorMessage = error.data.message;
                });
        }

    }
};
