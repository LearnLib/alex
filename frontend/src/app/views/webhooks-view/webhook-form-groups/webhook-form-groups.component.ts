/*
 * Copyright 2015 - 2022 TU Dortmund
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

import { Component, Input, OnInit } from '@angular/core';
import { Webhook } from '../../../entities/webhook';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { FormUtilsService } from '../../../services/form-utils.service';

@Component({
  selector: 'webhook-form-groups',
  templateUrl: './webhook-form-groups.component.html',
  styleUrls: ['./webhook-form-groups.component.scss']
})
export class WebhookFormGroupsComponent implements OnInit {

  @Input()
  public webhook: Webhook;

  @Input()
  public form: FormGroup;

  @Input()
  public events: string[];

  headerForm = new FormGroup({
    name: new FormControl('', [Validators.required]),
    value: new FormControl('')
  });

  public selectedEvent: string;

  constructor(public formUtils: FormUtilsService) {
    this.events = [];
    this.selectedEvent = '';
  }

  get remainingEvents(): string[] {
    return this.events.filter(e => this.webhook.events.indexOf(e) === -1);
  }

  ngOnInit(): void {
    this.form.addControl('name', new FormControl(this.webhook.name, [
      Validators.required
    ]));
    this.form.addControl('url', new FormControl(this.webhook.url, [
      Validators.required, Validators.pattern(/^https?:\/\/.*?/)
    ]));
    this.form.addControl('method', new FormControl(this.webhook.method, [
      Validators.required
    ]));
    this.form.addControl('events', new FormControl(this.webhook.events.length, [
      Validators.min(1)
    ]));
  }

  addSelectedEvent(): void {
    this.webhook.events.push(this.selectedEvent);
    this.selectedEvent = '';
    this.updateEventsFC();
  }

  addAllEvents(): void {
    this.webhook.events = [...this.events];
    this.selectedEvent = '';
    this.updateEventsFC();
  }

  removeEvent(i: number): void {
    this.webhook.events.splice(i, 1);
    this.updateEventsFC();
  }

  addHeader(): void {
    const header = this.headerForm.value;
    this.webhook.addHeader(header.name, header.value);
    this.headerForm.reset();
  }

  private updateEventsFC(): void {
    this.form.controls.events.setValue(this.webhook.events.length);
  }
}
