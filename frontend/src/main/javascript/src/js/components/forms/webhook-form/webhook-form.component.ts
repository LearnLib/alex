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

import { IFormController } from 'angular';

/**
 * The component for creating and editing a webhook.
 */
export const webhookFormComponent = {
  template: require('./webhook-form.component.html'),
  bindings: {
    form: '=',
    webhook: '=',
    events: '='
  },
  controllerAs: 'vm',
  controller: class WebhookFormComponent {

    public form: IFormController;

    public webhook: any;

    public events: string[];

    public selectedEvent: string;

    /** Constructor. */
    constructor() {
      this.selectedEvent = null;
      this.webhook = null;
      this.events = [];
    }

    /** Adds the selected event to the webhook. */
    addSelectedEvent(): void {
      if (this.selectedEvent != null
        && this.selectedEvent.trim() !== ''
        && this.webhook.events.findIndex((e) => e === this.selectedEvent) === -1) {

        this.webhook.events.push(this.selectedEvent);
        this.selectedEvent = null;
      }
    }

    /** Adds all available events to the webhook. */
    addAllEvents(): void {
      this.webhook.events = [].concat(this.events);
    }

    /**
     * Removes an event from the list.
     *
     * @param index The index of the event in the list.
     */
    removeEvent(index: number): void {
      this.webhook.events.splice(index, 1);
    }
  }
};
