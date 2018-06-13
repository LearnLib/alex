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

/**
 * The component for the modal dialog to create a new webhook.
 * @type {{template: *, bindings: {dismiss: string, close: string}, controllerAs: string, controller: webhookCreateModalComponent.WebhookCreateModalComponent}}
 */
export const webhookCreateModalComponent = {
    template: require('./webhook-create-modal.component.html'),
    bindings: {
        dismiss: '&',
        close: '&'
    },
    controllerAs: 'vm',
    controller: class WebhookCreateModalComponent {

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

            /**
             * The model for the webhook.
             * @type {{name: string, url: string, events: string[]}}
             */
            this.webhook = {
                name: null,
                url: 'http://',
                events: []
            };
        }

        $onInit() {
            this.webhookResource.getEvents()
                .then((events) => this.events = events)
                .catch(console.error);
        }

        /** Creates the webhook. */
        createWebhook() {
            this.errorMessage = null;

            if (this.webhook.events.length === 0) {
                this.errorMessage = 'You have to subscribe to at least one event.';
                return;
            }

            this.webhookResource.create(this.webhook)
                .then((webhook) => {
                    this.toastService.success('The webhook has been registered.');
                    this.close({$value: webhook});
                })
                .catch((error) => {
                    this.errorMessage = error.data.message;
                });
        }

    }
};
