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

import { ModalComponent } from '../modal.component';
import { WebhookApiService } from '../../../services/resources/webhook-api.service';
import { ToastService } from '../../../services/toast.service';

export const webhookEditModalComponent = {
  template: require('html-loader!./webhook-edit-modal.component.html'),
  bindings: {
    dismiss: '&',
    close: '&',
    resolve: '='
  },
  controllerAs: 'vm',
  controller: class WebhookEditModalComponent extends ModalComponent {

    /** he error message. */
    public errorMessage: string = null;

    /** The list of available events. */
    public events: string[] = [];

    /** The selected event. */
    public selectedEvent: string = null;

    /** The webhook to create. */
    public webhook: any = null;

    /**
     * Constructor.
     *
     * @param webhookApi
     * @param toastService
     */
    /* @ngInject */
    constructor(private webhookApi: WebhookApiService,
                private toastService: ToastService) {
      super();
    }

    $onInit(): void {
      this.webhook = this.resolve.webhook;

      this.webhookApi.getEvents().subscribe(
        events => this.events = events,
        console.error
      );
    }

    /** Updates the webhook. */
    updateWebhook(): void {
      this.errorMessage = null;

      if (this.webhook.events.length === 0) {
        this.errorMessage = 'You have to subscribe to at least one event.';
        return;
      }

      this.webhookApi.update(this.webhook).subscribe(
        webhook => {
          this.toastService.success('The webhook has been updated.');
          this.close({$value: webhook});
        },
        error => {
          this.errorMessage = error.data.message;
        }
      );
    }
  }
};
