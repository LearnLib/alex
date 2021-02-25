/*
 * Copyright 2015 - 2021 TU Dortmund
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
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { PromptModalComponent } from '../common/modals/prompt-modal/prompt-modal.component';
import { ConfirmModalComponent } from '../common/modals/confirm-modal/confirm-modal.component';

export interface PromptOptions {
  defaultValue?: string;
  required?: boolean;
  okBtnText?: string;
  cancelBtnText?: string;
}

@Injectable()
export class PromptService {

  constructor(private modalService: NgbModal) {
  }

  prompt(text: string, options: PromptOptions = {
    defaultValue: '',
    required: true
  }): Promise<any> {
    const modalRef = this.modalService.open(PromptModalComponent);
    modalRef.componentInstance.text = text;
    modalRef.componentInstance.options = options;
    return modalRef.result;
  }

  confirm(text: string): Promise<any> {
    const modalRef = this.modalService.open(ConfirmModalComponent);
    modalRef.componentInstance.text = text;
    return modalRef.result;
  }
}
