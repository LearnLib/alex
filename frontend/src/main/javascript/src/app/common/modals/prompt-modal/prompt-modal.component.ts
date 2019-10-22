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
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'prompt-modal',
  templateUrl: './prompt-modal.component.html'
})
export class PromptModalComponent implements OnInit {

  /** The text to display. */
  @Input()
  public text: string;

  /** The value to display when the dialog is opened. */
  @Input()
  public defaultValue: string;

  /** The model for the input field for the user input. */
  public input: string;

  constructor(public modal: NgbActiveModal) {
  }

  ngOnInit(): void {
    this.input = this.defaultValue;
  }

  accept(): void {
    this.modal.close(this.input.trim());
  }
}
