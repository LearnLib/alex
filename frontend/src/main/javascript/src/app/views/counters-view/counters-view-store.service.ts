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

import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { Counter } from '../../entities/counter';
import { CounterApiService } from '../../services/api/counter-api.service';
import { AppStoreService } from '../../services/app-store.service';
import { Selectable } from '../../utils/selectable';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ToastService } from '../../services/toast.service';
import { CreateCounterModalComponent } from './create-counter-modal/create-counter-modal.component';
import { map } from 'rxjs/operators';
import { orderBy } from 'lodash';

@Injectable()
export class CountersViewStoreService {

  private counters: BehaviorSubject<Counter[]>;

  countersSelectable: Selectable<Counter>;

  constructor(private appStore: AppStoreService,
              private counterApi: CounterApiService,
              private modalService: NgbModal,
              private toastService: ToastService) {
    this.counters = new BehaviorSubject<Counter[]>([]);
    this.countersSelectable = new Selectable<Counter>([], 'id');
  }

  get counters$(): Observable<Counter[]> {
    return this.counters.asObservable();
  }

  get orderedCounters$(): Observable<Counter[]> {
    return this.counters.pipe(
      map(counters => orderBy(counters, ['name']))
    );
  }

  load(): void {
    this.counterApi.getAll(this.appStore.project.id).subscribe(
      counters => {
        this.counters.next(counters);
        this.countersSelectable.addItems(counters);
      }
    );
  }

  /**
   * Create a new counter.
   */
  createCounter(): void {
    const modalRef = this.modalService.open(CreateCounterModalComponent);
    modalRef.result
      .then((createdCounter: Counter) => {
        this.counters.next([...this.counters.value, createdCounter]);
        this.countersSelectable.addItem(createdCounter);
      })
      .catch(() => {
      });
  }

  /**
   * Updates a counter.
   *
   * @param counter The updated counter.
   */
  updateCounter(counter: Counter): void {
    this.counterApi.update(this.appStore.project.id, counter).subscribe(
      (updatedCounter) => {
        const counters = this.counters.value;
        const i = counters.findIndex(c => c.id === counter.id);
        counters[i] = updatedCounter;
        this.counters.next(counters);
        this.countersSelectable.update(updatedCounter);
      },
      res => this.toastService.danger(`The counter could not be updated. ${res.error.message}`)
    );
  }

  /**
   * Delete a counter from the server and on success from scope.
   *
   * @param counter The counter that should be deleted.
   */
  deleteCounter(counter: Counter): void {
    this.counterApi.remove(this.appStore.project.id, counter).subscribe(
      () => {
        const counters = this.counters.value.filter(c => c.id !== counter.id);
        this.counters.next(counters);
        this.countersSelectable.unselect(counter);
      },
      err => {
        this.toastService.danger('<p><strong>Deleting counter "' + counter.name + '" failed</strong></p>' + err.data.message);
      }
    );
  }

  /**
   * Delete all selected counters from the server and on success from scope.
   */
  deleteSelectedCounters(): void {
    const selectedCounters = this.countersSelectable.getSelected();
    if (selectedCounters.length > 0) {
      this.counterApi.removeMany(this.appStore.project.id, selectedCounters).subscribe(
        () => {
          const counters = this.counters.value.filter(c => selectedCounters.findIndex(c2 => c.id == c2.id) === -1);
          this.counters.next(counters);
          this.countersSelectable.unselectMany(selectedCounters);
        },
        err => {
          this.toastService.danger('<p><strong>Deleting counters failed</strong></p>' + err.data.message);
        }
      );
    } else {
      this.toastService.info('You have to select at least one counter.');
    }
  }
}
