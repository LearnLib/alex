/*
 * Copyright 2015 - 2021 TU Dortmund
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

import { Injectable } from '@angular/core';
import { WebhookApiService } from '../../services/api/webhook-api.service';
import { BehaviorSubject, Observable } from 'rxjs';
import { Webhook } from '../../entities/webhook';
import { Selectable } from '../../utils/selectable';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { CreateWebhookModalComponent } from './create-webhook-modal/create-webhook-modal.component';
import { removeItems, replaceItem } from '../../utils/list-utils';
import { ToastService } from '../../services/toast.service';
import { EditWebhookModalComponent } from './edit-webhook-modal/edit-webhook-modal.component';

@Injectable()
export class WebhooksViewStoreService {

  public webhooksSelectable: Selectable<Webhook, number>;
  private webhooks: BehaviorSubject<Webhook[]>;
  private events: BehaviorSubject<string[]>;

  constructor(private webhookApi: WebhookApiService,
              private modalService: NgbModal,
              private toastService: ToastService) {
    this.webhooks = new BehaviorSubject<Webhook[]>([]);
    this.events = new BehaviorSubject<string[]>([]);
    this.webhooksSelectable = new Selectable<Webhook, number>(w => w.id);
  }

  get webhooks$(): Observable<Webhook[]> {
    return this.webhooks.asObservable();
  }

  get events$(): Observable<string[]> {
    return this.events.asObservable();
  }

  public load(): void {
    this.webhookApi.getAll().subscribe(
      whs => {
        this.webhooks.next(whs);
        this.webhooksSelectable.addItems(whs);
      }
    );

    this.webhookApi.getEvents().subscribe(
      events => this.events.next(events)
    );
  }

  create(): void {
    const modalRef = this.modalService.open(CreateWebhookModalComponent);
    modalRef.componentInstance.store = this;
    modalRef.result.then(wh => {
      this.webhooks.next([...this.webhooks.value, wh]);
      this.webhooksSelectable.addItem(wh);
    }).catch(() => {
    });
  }

  edit(webhook: Webhook): void {
    const modalRef = this.modalService.open(EditWebhookModalComponent);
    modalRef.componentInstance.webhook = webhook.copy();
    modalRef.componentInstance.store = this;
    modalRef.result.then(wh => {
      this.webhooks.next(replaceItem(this.webhooks.value, w => w.id === wh.id, wh));
      this.webhooksSelectable.update(wh);
    }).catch(() => {
    });
  }

  delete(webhook: Webhook): void {
    this.webhookApi.remove(webhook).subscribe(
      () => {
        this.webhooks.next(removeItems(this.webhooks.value, w => w.id === webhook.id));
        this.webhooksSelectable.remove(webhook);
      },
      res => this.toastService.danger(`The webhook could not be deleted. ${res.error.message}`)
    );
  }

  deleteSelected(): void {
    const selected = this.webhooksSelectable.getSelected();
    if (selected.length > 0) {
      const ids = selected.map(w => w.id);
      this.webhookApi.removeMany(selected).subscribe(
        () => {
          this.webhooks.next(removeItems(this.webhooks.value, w => ids.indexOf(w.id) > -1));
          this.webhooksSelectable.removeMany(selected);
        },
        res => this.toastService.danger(`The webhooks could not be deleted. ${res.error.message}`)
      );
    }
  }
}
