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

import {ModalComponent} from '../modal.component';
import {WebhookResource} from '../../../services/resources/webhook-resource.service';
import {ToastService} from '../../../services/toast.service';

/**
 * The component for the modal dialog to create a new webhook.
 */
export const webhookCreateModalComponent = {
  template: require('./webhook-create-modal.component.html'),
  bindings: {
    dismiss: '&',
    close: '&'
  },
  controllerAs: 'vm',
  controller: class WebhookCreateModalComponent extends ModalComponent {

    /** he error message. */
    public errorMessage: string = null;

    /** The list of available events. */
    public events: string[] = [];

    /** The selected event. */
    public selectedEvent: string = null;

    /** The webhook to create. */
    public webhook: any;

    /**
     * Constructor.
     *
     * @param webhookResource
     * @param toastService
     */
    /* @ngInject */
    constructor(private webhookResource: WebhookResource,
                private toastService: ToastService) {
      super();

      this.webhook = {
        name: null,
        url: 'http://',
        events: []
      };
    }

    $onInit(): void {
      this.webhookResource.getEvents()
        .then((events) => this.events = events)
        .catch(console.error);
    }

    /** Creates the webhook. */
    createWebhook(): void {
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