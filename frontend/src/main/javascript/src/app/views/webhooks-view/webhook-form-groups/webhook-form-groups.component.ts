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

import { Component, Input, OnInit } from '@angular/core';
import { Webhook } from '../../../entities/webhook';
import { AbstractControl, FormControl, FormGroup, Validators } from '@angular/forms';

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

  public selectedEvent: string;

  constructor() {
    this.events = [];
    this.selectedEvent = '';
  }

  ngOnInit(): void {
    this.form.addControl('name', new FormControl(this.webhook.name, [
      Validators.required
    ]));
    this.form.addControl('url', new FormControl(this.webhook.url, [
      Validators.required, Validators.pattern(/^https?:\/\/.*?/)
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

  isInvalidFormControl(c: AbstractControl): boolean {
    return c.invalid && (c.dirty || c.touched);
  }

  private updateEventsFC(): void {
    this.form.controls.events.setValue(this.webhook.events.length);
  }

  get remainingEvents(): string[] {
    return this.events.filter(e => this.webhook.events.indexOf(e) === -1);
  }
}
