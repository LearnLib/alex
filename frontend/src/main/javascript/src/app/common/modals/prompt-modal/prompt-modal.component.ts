/*
 * Copyright 2015 - 2020 TU Dortmund
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
import { FormControl, FormGroup, ValidatorFn, Validators } from '@angular/forms';
import { FormUtilsService } from '../../../services/form-utils.service';

@Component({
  selector: 'prompt-modal',
  templateUrl: './prompt-modal.component.html'
})
export class PromptModalComponent implements OnInit {

  /** The text to display. */
  @Input()
  text: string;

  /** The value to display when the dialog is opened. */
  @Input()
  defaultValue: string;

  @Input()
  validators: ValidatorFn[];

  form = new FormGroup({
    input: new FormControl('', [])
  });

  constructor(public modal: NgbActiveModal,
              public formUtils: FormUtilsService) {
    this.validators = [];
  }

  ngOnInit(): void {
    const validators = [...this.validators, Validators.required];

    this.form.controls.input.setValue(this.defaultValue != null ? this.defaultValue : '');
    this.form.controls.input.setValidators(validators);
  }

  accept(): void {
    this.modal.close(this.form.controls.input.value.trim());
  }
}
