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

import { SymbolGroupUtils } from '../../../utils/symbol-group-utils';
import { SymbolGroupApiService } from '../../../services/api/symbol-group-api.service';
import { ToastService } from '../../../services/toast.service';
import { SymbolGroup } from '../../../entities/symbol-group';
import { Component, Input, OnInit } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'move-symbol-group-modal',
  templateUrl: './move-symbol-group-modal.component.html'
})
export class MoveSymbolGroupModalComponent implements OnInit {

  /** The group to move. */
  @Input()
  group: SymbolGroup = null;

  /** The error message to display. */
  errorMessage: string;

  /** List of all groups in the project. */
  groups: SymbolGroup[] = [];

  /** The new parent group. */
  selectedGroup: SymbolGroup;

  constructor(private symbolGroupApi: SymbolGroupApiService,
              private toastService: ToastService,
              public modal: NgbActiveModal) {
  }

  ngOnInit(): void {
    this.symbolGroupApi.getAll(this.group.project).subscribe(
      groups => {
        this.groups = groups;

        if (this.group.parent != null) {
          this.selectedGroup = SymbolGroupUtils.findGroupById(this.groups, this.group.parent);
        }
      }
    );
  }

  /**
   * Moves the group.
   */
  moveGroup(): void {
    const fromGroupId = this.group.parent;
    this.group.parent = this.selectedGroup == null ? null : this.selectedGroup.id;

    this.symbolGroupApi.move(this.group).subscribe(
      (movedGroup: SymbolGroup) => {
        this.toastService.success('The group has been moved');
        this.modal.close(movedGroup);
      },
      res => {
        this.errorMessage = `The group could not be moved. ${res.error.message}`;
        this.group.parent = fromGroupId;
      }
    );
  }

  /**
   * Select the target group.
   *
   * @param group The selected group.
   */
  setSelectedGroup(group: SymbolGroup): void {
    if (this.selectedGroup != null && this.selectedGroup.id === group.id) {
      this.selectedGroup = null;
    } else {
      this.selectedGroup = group;
    }
  }
}
