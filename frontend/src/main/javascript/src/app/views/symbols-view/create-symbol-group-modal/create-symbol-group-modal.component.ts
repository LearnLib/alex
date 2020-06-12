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

import { SymbolGroup } from '../../../entities/symbol-group';
import { Project } from '../../../entities/project';
import { SymbolGroupApiService } from '../../../services/api/symbol-group-api.service';
import { ToastService } from '../../../services/toast.service';
import { AppStoreService } from '../../../services/app-store.service';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { FormUtilsService } from '../../../services/form-utils.service';

/**
 * The controller for the modal dialog that handles the creation of a new symbol group.
 */
@Component({
  selector: 'create-symbol-group-modal',
  templateUrl: './create-symbol-group-modal.component.html'
})
export class CreateSymbolGroupModalComponent implements OnInit {

  /** All available groups of the project. */
  groups: SymbolGroup[];

  /** The selected symbol group. */
  selectedSymbolGroup: SymbolGroup;

  /** An error message that can be displayed in the modal template. */
  errorMessage: string;

  form = new FormGroup({
    name: new FormControl('', [Validators.required])
  });

  constructor(private appStore: AppStoreService,
              private symbolGroupApi: SymbolGroupApiService,
              private toastService: ToastService,
              public modal: NgbActiveModal,
              public formUtils: FormUtilsService) {
    this.groups = [];
    this.selectedSymbolGroup = null;
    this.errorMessage = null;
  }

  get project(): Project {
    return this.appStore.project;
  }

  ngOnInit(): void {
    this.symbolGroupApi.getAll(this.project.id).subscribe(
      groups => this.groups = groups
    );
  }

  /**
   * Creates a new symbol group and closes the modal on success and passes the newly created symbol group.
   */
  createGroup(): void {
    this.errorMessage = null;

    const group = new SymbolGroup();
    group.parent = this.selectedSymbolGroup == null ? null : this.selectedSymbolGroup.id;
    group.name = this.form.controls.name.value;
    group.project = this.project.id;

    this.symbolGroupApi.create(this.project.id, group).subscribe(
      createdGroup => {
        this.toastService.success('Symbol group <strong>' + createdGroup.name + '</strong> created');
        this.modal.close(createdGroup);
      },
      response => {
        this.errorMessage = response.error.message;
      }
    );
  }

  selectSymbolGroup(group: SymbolGroup): void {
    if (this.selectedSymbolGroup != null && this.selectedSymbolGroup.id === group.id) {
      this.selectedSymbolGroup = null;
    } else {
      this.selectedSymbolGroup = group;
    }
  }
}
