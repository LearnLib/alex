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

import { SymbolGroup } from '../../../entities/symbol-group';
import { SymbolGroupApiService } from '../../../services/api/symbol-group-api.service';
import { ToastService } from '../../../services/toast.service';
import { EventBus } from '../../../services/eventbus.service';
import { Component, Input, OnInit } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { AbstractControl, FormControl, FormGroup, Validators } from '@angular/forms';
import { FormUtilsService } from '../../../services/form-utils.service';

/**
 * The controller that handles the modal dialog for deleting and updating a symbol group. The modal data that is
 * passed must have an property 'group' whose value should be an instance of SymbolGroup.
 */
@Component({
  selector: 'edit-symbol-group-modal',
  templateUrl: './edit-symbol-group-modal.component.html'
})
export class EditSymbolGroupModalComponent implements OnInit {

  /** The symbol group that should be edited. */
  @Input()
  group: SymbolGroup;

  /** An error message that can be displayed in the template. */
  errorMessage: string;

  form = new FormGroup({
    name: new FormControl('', [Validators.required])
  });

  constructor(private symbolGroupApi: SymbolGroupApiService,
              private toastService: ToastService,
              private eventBus: EventBus,
              public modal: NgbActiveModal,
              public formUtils: FormUtilsService) {
  }

  ngOnInit(): void {
    this.form.controls.name.setValue(this.group.name);
  }

  /**
   * Updates the symbol group under edit and closes the modal dialog on success.
   */
  updateGroup(): void {
    this.errorMessage = null;

    this.group.symbols = [];
    this.group.name = this.form.controls.name.value;

    this.symbolGroupApi.update(this.group).subscribe(
      updatedGroup => {
        this.toastService.success('Group updated');
        this.eventBus.groupUpdated$.next(updatedGroup);
        this.modal.dismiss();
      },
      res => {
        this.errorMessage = res.error.message;
      }
    );
  }
}
