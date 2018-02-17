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

export const webhooksViewComponent = {
    template: require('./webhooks-view.component.html'),
    controllerAs: 'vm',
    controller: class WebhooksViewComponent {

        /**
         * Constructor.
         * @param {WebhookResource} WebhookResource
         * @param {ToastService} ToastService
         * @param $uibModal
         */
        // @ngInject
        constructor(WebhookResource, ToastService, $uibModal) {
            this.webhookResource = WebhookResource;
            this.toastService = ToastService;
            this.$uibModal = $uibModal;

            /**
             * The list of webhooks of the user.
             * @type {Object[]}
             */
            this.webhooks = [];
        }

        $onInit() {
            this.webhookResource.getAll()
                .then((webhooks) => {
                    this.webhooks = webhooks;
                })
                .catch(console.error);
        }

        /** Opens the modal dialog to create a new webhook. */
        createWebhook() {
            this.$uibModal.open({
                component: 'webhookCreateModal',
            }).result.then((webhook) => {
                this.webhooks.push(webhook);
            });
        }

        /**
         * Opens the modal dialog to edit a webhook.
         *
         * @param {Object} webhook The webhook to edit.
         */
        updateWebhook(webhook) {
            const wh = JSON.parse(JSON.stringify(webhook));
            delete wh._selected;

            this.$uibModal.open({
                component: 'webhookEditModal',
                resolve: {
                    modalData: () => ({webhook: wh})
                }
            }).result.then((webhook) => {
                const i = this.webhooks.findIndex((w) => w.id === webhook.id);
                if (i > -1) this.webhooks[i] = webhook;
            });
        }

        /**
         * Deletes a webhook.
         *
         * @param webhook The webhook to delete.
         */
        deleteWebhook(webhook) {
            this.webhookResource.remove(webhook)
                .then(() => {
                    this.toastService.success('The webhook has been deleted.');
                    this.webhooks = this.webhooks.filter((w) => w.id !== webhook.id);
                })
                .catch((error) => {
                    this.toastService.danger(`The webhook could not be deleted. ${error.data.message}`);
                });
        }

        /** Deletes all selected webhooks. */
        deleteSelectedWebhooks() {
            const webhooks = this.webhooks.filter((w) => w._selected);
            if (webhooks.length === 0) {
                this.toastService.info('You have to select at least one webhook.');
                return;
            }

            this.webhookResource.removeMany(webhooks)
                .then(() => {
                    this.toastService.success('The webhooks have been deleted.');
                    this.webhooks = this.webhooks.filter((w1) =>
                        !(webhooks.findIndex((w2) => w2.id === w1.id) > -1)
                    );
                })
                .catch((error) => {
                    this.toastService.danger(`The webhooks could not be deleted. ${error.data.message}`);
                });
        }
    }
};
