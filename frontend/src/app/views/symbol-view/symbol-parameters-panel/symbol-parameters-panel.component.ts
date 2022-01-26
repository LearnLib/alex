/*
 * Copyright 2015 - 2022 TU Dortmund
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
import { SymbolParameterApiService } from '../../../services/api/symbol-parameter-api.service';
import { ToastService } from '../../../services/toast.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { AlphabetSymbol } from '../../../entities/alphabet-symbol';
import { CreateSymbolParameterModalComponent } from './create-symbol-parameter-modal/create-symbol-parameter-modal.component';
import { EditSymbolParameterModalComponent } from './edit-symbol-parameter-modal/edit-symbol-parameter-modal.component';

@Component({
  selector: 'symbol-parameters-panel',
  templateUrl: './symbol-parameters-panel.component.html',
  styleUrls: ['./symbol-parameters-panel.component.scss']
})
export class SymbolParametersPanelComponent {

  @Input()
  symbol: AlphabetSymbol;

  @Output()
  inputsChange: EventEmitter<any>;

  @Output()
  outputsChange: EventEmitter<any>;

  constructor(private symbolParameterApi: SymbolParameterApiService,
              private toastService: ToastService,
              private modalService: NgbModal) {
    this.inputsChange = new EventEmitter<any>();
    this.outputsChange = new EventEmitter<any>();
  }

  addInput(): void {
    const modalRef = this.modalService.open(CreateSymbolParameterModalComponent);
    modalRef.componentInstance.symbol = this.symbol;
    modalRef.componentInstance.type = 'input';
    modalRef.result.then((param: any) => {
      const inputs = [...this.symbol.inputs, param];
      this.inputsChange.emit(inputs);
    }).catch(() => {
    });
  }

  addOutput(): void {
    const modalRef = this.modalService.open(CreateSymbolParameterModalComponent);
    modalRef.componentInstance.symbol = this.symbol;
    modalRef.componentInstance.type = 'output';
    modalRef.result.then((param: any) => {
      const outputs = [...this.symbol.outputs, param];
      this.outputsChange.emit(outputs);
    }).catch(() => {
    });
  }

  editInput(input: any, index: number): void {
    const modalRef = this.modalService.open(EditSymbolParameterModalComponent);
    modalRef.componentInstance.symbol = this.symbol;
    modalRef.componentInstance.parameter = JSON.parse(JSON.stringify(input));
    modalRef.result.then((param: any) => {
      const inputs = [...this.symbol.inputs];
      inputs[index] = param;
      this.inputsChange.emit(inputs);
    }).catch(() => {
    });
  }

  editOutput(output: any, index: number): void {
    const modalRef = this.modalService.open(EditSymbolParameterModalComponent);
    modalRef.componentInstance.symbol = this.symbol;
    modalRef.componentInstance.parameter = JSON.parse(JSON.stringify(output));
    modalRef.result.then((param: any) => {
      const outputs = [...this.symbol.outputs];
      outputs[index] = param;
      this.outputsChange.emit(outputs);
    }).catch(() => {
    });
  }

  removeInput(index: number): void {
    const param = this.symbol.inputs[index];
    this.symbolParameterApi.remove(this.symbol.project, this.symbol.id, param.id).subscribe(
      () => {
        const inputs = [...this.symbol.inputs];
        inputs.splice(index, 1);
        this.inputsChange.emit(inputs);
      },
      res => this.toastService.danger(`The input parameter could not be deleted. ${res.error.message}`)
    );
  }

  removeOutput(index: number): void {
    const param = this.symbol.outputs[index];
    this.symbolParameterApi.remove(this.symbol.project, this.symbol.id, param.id).subscribe(
      () => {
        const outputs = [...this.symbol.outputs];
        outputs.splice(index, 1);
        this.outputsChange.emit(outputs);
      },
      res => this.toastService.danger(`The output parameter could not be deleted. ${res.error.message}`)
    );
  }
}
