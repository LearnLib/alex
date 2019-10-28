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

import { Component, EventEmitter, Input, Output } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'pagination',
  templateUrl: './pagination.component.html'
})
export class PaginationComponent {

  @Input()
  public page: any;

  @Output('next')
  public onNext: EventEmitter<void>;

  @Output('previous')
  public onPrevious: EventEmitter<void>;

  constructor() {
    this.onNext = new EventEmitter<void>();
    this.onPrevious = new EventEmitter<void>();
  }

  next() {
    if (!this.page.last) {
      this.onNext.emit();
    }
  }

  previous() {
    if (!this.page.first) {
      this.onPrevious.emit();
    }
  }
}