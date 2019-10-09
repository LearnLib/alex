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

import { Component, Input } from '@angular/core';
import { WebhooksViewStoreService } from '../webhooks-view-store.service';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { FormGroup } from '@angular/forms';
import { Webhook } from '../../../entities/webhook';
import { WebhookApiService } from '../../../services/resources/webhook-api.service';

@Component({
  selector: 'create-webhook-modal',
  templateUrl: './create-webhook-modal.component.html'
})
export class CreateWebhookModalComponent {

  @Input()
  public store: WebhooksViewStoreService;

  public errorMessage: string;
  public form: FormGroup;
  public webhook: Webhook;

  constructor(public modal: NgbActiveModal,
              private webhookApi: WebhookApiService) {
    this.form = new FormGroup({});
    this.webhook = new Webhook();
  }

  createWebhook(): void {
    const wh = this.webhook.copy();
    wh.name = this.form.controls.name.value;
    wh.url = this.form.controls.url.value;

    this.webhookApi.create(wh).subscribe(
      createdWh => this.modal.close(createdWh),
      err => this.errorMessage = err.data.message
    );
  }
}
