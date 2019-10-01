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

import { Component } from '@angular/core';
import { Counter } from '../../../entities/counter';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { CounterApiService } from '../../../services/resources/counter-api.service';
import { AppStoreService } from '../../../services/app-store.service';

@Component({
  selector: 'create-counter-modal',
  templateUrl: './create-counter-modal.component.html'
})
export class CreateCounterModalComponent {

  errorMessage: string;

  counter: Counter;

  constructor(public modal: NgbActiveModal,
              private counterApi: CounterApiService,
              private appStore: AppStoreService) {
    this.counter = new Counter();
  }

  createCounter(): void {
    this.counter.project = this.appStore.project.id;
    this.counterApi.create(this.appStore.project.id, this.counter).subscribe(
      createdCounter => this.modal.close(createdCounter),
      res => this.errorMessage = res.error.message
    );
  }
}
