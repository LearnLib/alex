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

import remove from 'lodash/remove';
import {Selectable} from '../../../utils/selectable';

export const webhooksViewComponent = {
    template: require('./webhooks-view.component.html'),
    controllerAs: 'vm',
    controller: class WebhooksViewComponent {

        /**
         * Constructor.
         *
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

            this.selectedWebhooks = new Selectable(this.webhooks, 'id');
        }

        $onInit() {
            this.webhookResource.getAll()
                .then((webhooks) => {
                    this.webhooks = webhooks;
                    this.selectedWebhooks = new Selectable(this.webhooks, 'id');
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
            this.$uibModal.open({
                component: 'webhookEditModal',
                resolve: {
                    webhook: () => JSON.parse(JSON.stringify(webhook))
                }
            }).result.then((webhook) => {
                const i = this.webhooks.findIndex((w) => w.id === webhook.id);
                this.webhooks[i] = webhook;
                this.selectedWebhooks.update(webhook);
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
                    this._deleteWebhook(webhook);
                })
                .catch((error) => {
                    this.toastService.danger(`The webhook could not be deleted. ${error.data.message}`);
                });
        }

        /** Deletes all selected webhooks. */
        deleteSelectedWebhooks() {
            const webhooks = this.selectedWebhooks.getSelected();
            if (webhooks.length === 0) {
                this.toastService.info('You have to select at least one webhook.');
                return;
            }

            this.webhookResource.removeMany(webhooks)
                .then(() => {
                    this.toastService.success('The webhooks have been deleted.');
                    webhooks.forEach(wh => this._deleteWebhook(wh));
                })
                .catch((error) => {
                    this.toastService.danger(`The webhooks could not be deleted. ${error.data.message}`);
                });
        }

        _deleteWebhook(webhook) {
            remove(this.webhooks, {id: webhook.id});
            this.selectedWebhooks.unselect(webhook);
        }
    }
};
