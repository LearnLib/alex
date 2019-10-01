/*
 * Copyright 2015 - 2019 TU Dortmund
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

import { remove } from 'lodash';
import { Selectable } from '../../../utils/selectable';
import { WebhookApiService } from '../../../services/resources/webhook-api.service';
import { ToastService } from '../../../services/toast.service';

export const webhooksViewComponent = {
  template: require('html-loader!./webhooks-view.component.html'),
  controllerAs: 'vm',
  controller: class WebhooksViewComponent {

    /** The list of webhooks of the user. */
    public webhooks: any[];

    public selectedWebhooks: Selectable<any>;

    /* @ngInject */
    constructor(private webhookApi: WebhookApiService,
                private toastService: ToastService,
                private $uibModal: any) {
      this.webhooks = [];
      this.selectedWebhooks = new Selectable(this.webhooks, 'id');
    }

    $onInit(): void {
      this.webhookApi.getAll().subscribe(
        webhooks => {
          this.webhooks = webhooks;
          this.selectedWebhooks = new Selectable(this.webhooks, 'id');
        },
        console.error
      );
    }

    /** Opens the modal dialog to create a new webhook. */
    createWebhook(): void {
      this.$uibModal.open({
        component: 'webhookCreateModal',
      }).result.then((webhook) => {
        this.webhooks.push(webhook);
      });
    }

    /**
     * Opens the modal dialog to edit a webhook.
     *
     * @param webhook The webhook to edit.
     */
    updateWebhook(webhook: any): void {
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
    deleteWebhook(webhook: any): void {
      this.webhookApi.remove(webhook).subscribe(
        () => {
          this.toastService.success('The webhook has been deleted.');
          this._deleteWebhook(webhook);
        },
        error => {
          this.toastService.danger(`The webhook could not be deleted. ${error.data.message}`);
        }
      );
    }

    /** Deletes all selected webhooks. */
    deleteSelectedWebhooks(): void {
      const webhooks = this.selectedWebhooks.getSelected();
      if (webhooks.length === 0) {
        this.toastService.info('You have to select at least one webhook.');
        return;
      }

      this.webhookApi.removeMany(webhooks).subscribe(
        () => {
          this.toastService.success('The webhooks have been deleted.');
          webhooks.forEach(wh => this._deleteWebhook(wh));
        },
        error => {
          this.toastService.danger(`The webhooks could not be deleted. ${error.data.message}`);
        }
      );
    }

    private _deleteWebhook(webhook: any): void {
      remove(this.webhooks, {id: webhook.id});
      this.selectedWebhooks.unselect(webhook);
    }
  }
};
