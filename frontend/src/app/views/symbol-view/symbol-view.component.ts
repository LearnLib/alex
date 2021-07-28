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

import { remove, uniqueId } from 'lodash';
import { AlphabetSymbol } from '../../entities/alphabet-symbol';
import { ParametrizedSymbol } from '../../entities/parametrized-symbol';
import { ClipboardMode, ClipboardService } from '../../services/clipboard.service';
import { Selectable } from '../../utils/selectable';
import { SymbolApiService } from '../../services/api/symbol-api.service';
import { ToastService } from '../../services/toast.service';
import { ActionService } from '../../services/action.service';
import { SymbolGroupApiService } from '../../services/api/symbol-group-api.service';
import { SymbolGroup } from '../../entities/symbol-group';
import { Project } from '../../entities/project';
import { Action } from '../../entities/actions/action';
import { AppStoreService } from '../../services/app-store.service';
import { ErrorViewStoreService } from '../error-view/error-view-store.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { SelectSymbolModalComponent } from '../../common/modals/select-symbol-modal/select-symbol-modal.component';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { EditActionModalComponent } from './edit-action-modal/edit-action-modal.component';
import { CreateActionModalComponent } from './create-action-modal/create-action-modal.component';
import { SymbolGroupUtils } from '../../utils/symbol-group-utils';
import { CdkDragDrop, moveItemInArray } from '@angular/cdk/drag-drop';

/**
 * The controller that handles the page for managing all actions of a symbol. The symbol whose actions should be
 * manages has to be defined in the url by its id.
 */
@Component({
  selector: 'symbol-view',
  templateUrl: './symbol-view.component.html',
  styleUrls: ['./symbol-view.component.scss']
})
export class SymbolViewComponent implements OnInit, OnDestroy {

  /** The symbol whose actions are managed. */
  symbol: AlphabetSymbol;

  /** All symbol groups. */
  groups: SymbolGroup[];

  /** A flattened view over all symbol groups. */
  flatGroups: SymbolGroup[];

  /** The selected actions. */
  selectedSteps: Selectable<any, any>;

  private readonly keyDownHandler: any;

  constructor(private symbolApi: SymbolApiService,
              private appStore: AppStoreService,
              private toastService: ToastService,
              private actionService: ActionService,
              public clipboardService: ClipboardService,
              private errorViewStore: ErrorViewStoreService,
              private symbolGroupApi: SymbolGroupApiService,
              private modalService: NgbModal,
              private currentRoute: ActivatedRoute) {

    this.symbol = null;
    this.groups = [];
    this.flatGroups = [];
    this.selectedSteps = new Selectable(s => s._id);

    currentRoute.paramMap.subscribe(map => {
      const symbolId = Number(map.get('symbolId'));
      this.symbolApi.get(this.project.id, symbolId).subscribe(
        symbol => {
          this.symbol = symbol;
          this.symbol.steps.forEach(step => step._id = uniqueId());
          this.selectedSteps.addItems(this.symbol.steps);
        },
        () => {
          errorViewStore.navigateToErrorPage(`The symbol with the ID "${symbolId}" could not be found`);
        }
      );
    });

    this.symbolGroupApi.getAll(this.project.id).subscribe(groups => this.groups = groups);

    this.keyDownHandler = this.handleKeyDown.bind(this);
  }

  get project(): Project {
    return this.appStore.project;
  }

  ngOnInit(): void {
    document.addEventListener('keydown', this.keyDownHandler);
  }

  ngOnDestroy(): void {
    document.removeEventListener('keydown', this.keyDownHandler);
  }

  drop(event: CdkDragDrop<string[]>): void {
    moveItemInArray(this.symbol.steps, event.previousIndex, event.currentIndex);
  }

  /**
   * Deletes a list of actions.
   *
   * @param steps The actions to be deleted.
   */
  deleteSteps(steps: any[]): void {
    if (steps.length > 0) {
      steps.forEach(step => {
        remove(this.symbol.steps, {_id: step._id});
      });
      this.selectedSteps.removeMany(steps);
    }
  }

  deleteSelectedSteps(): void {
    this.deleteSteps(this.selectedSteps.getSelected());
  }

  editSelectedAction(): void {
    if (this.selectedSteps.getSelected().length === 1) {
      const step = this.selectedSteps.getSelected()[0];
      if (step.type === 'action') {
        this.editActionStep(step);
      } else if (step.type === 'symbol') {
        this.editSymbolStep(step);
      }
    }
  }

  /**
   * Adds a new action to the list of actions of the symbol and gives it a temporary unique id.
   *
   * @param action The action to add.
   */
  addAction(action: Action): void {
    const step = {
      _id: uniqueId(),
      type: 'action',
      errorOutput: null,
      negated: false,
      ignoreFailure: false,
      action: this.actionService.create(JSON.parse(JSON.stringify(action)))
    };
    this.symbol.steps.push(step);
    this.selectedSteps.addItem(step);
  }

  /**
   * Adds a new action to the list of actions of the symbol and gives it a temporary unique id.
   */
  addSymbolStep(): void {
    const modalRef = this.modalService.open(SelectSymbolModalComponent);
    modalRef.result.then((symbol: AlphabetSymbol) => {
      if (symbol.id === this.symbol.id) {
        this.toastService.info('A symbol cannot execute itself');
        return;
      }

      const step = {
        _id: uniqueId(),
        type: 'symbol',
        errorOutput: null,
        negated: false,
        ignoreFailure: false,
        pSymbol: ParametrizedSymbol.fromSymbol(symbol)
      };
      this.symbol.steps.push(step);
      this.selectedSteps.addItem(step);
    }).catch(() => {});
  }

  /**
   * Deletes a symbol step.
   *
   * @param $index The index of the step to delete.
   */
  deleteStep($index: number): void {
    const step = this.symbol.steps[$index];
    this.symbol.steps.splice($index, 1);
    this.selectedSteps.remove(step);
  }

  /**
   * Saves the changes that were made to the symbol by updating it on the server.
   */
  saveChanges() {
    const symbolToUpdate = this.symbol.toJson();
    symbolToUpdate.steps.forEach(s => delete s._id);

    return this.symbolApi.update(symbolToUpdate).subscribe(
      updatedSymbol => {
        this.toastService.success('Symbol <strong>' + updatedSymbol.name + '</strong> updated');
        this.symbol = updatedSymbol;
        this.symbol.steps.forEach(step => step._id = uniqueId());
        this.selectedSteps.clear();
        this.selectedSteps.addItems(this.symbol.steps);
      },
      res => {
        this.toastService.danger('<strong>Error updating symbol</strong><div>' + res.error.message + '</div>');
      }
    );
  }

  /** Copies actions to the clipboard. */
  copySelectedSteps(): void {
    let steps = this.selectedSteps.getSelected();
    if (steps.length > 0) {
      steps = steps.map(AlphabetSymbol.stepsToJson);
      steps.forEach(step => {
        delete step._id;
      });
      this.clipboardService.copy(this.project.id, 'symbolSteps', steps);
      this.toastService.info(steps.length + ' steps copied to clipboard');
    }
  }

  copyStep(step: any): void {
    const s = AlphabetSymbol.stepsToJson(step);
    delete s._id;

    this.clipboardService.copy(this.project.id, 'symbolSteps', [s]);
    this.toastService.info('The action has been copied to the clipboard.');
  }

  /** Copies actions to the clipboard and removes them from the scope. */
  cutSelectedSteps(): void {
    const steps = this.selectedSteps.getSelected();
    if (steps.length > 0) {
      const cpy = steps.map(AlphabetSymbol.stepsToJson);
      cpy.forEach(step => {
        delete step._id;
      });
      this.clipboardService.copy(this.project.id, 'symbolSteps', cpy, ClipboardMode.CUT);
      this.deleteSteps(steps);
      this.toastService.info(steps.length + ' steps cut to clipboard');
    }
  }

  cutStep(step: any): void {
    const s = AlphabetSymbol.stepsToJson(step);
    delete s._id;

    this.clipboardService.copy(this.project.id, 'symbolSteps', [s], ClipboardMode.CUT);
    this.deleteSteps([step]);
    this.toastService.info('The action has been copied to the clipboard.');
  }

  /**
   * Pastes the actions from the clipboard to the end of of the action list.
   */
  pasteSteps(): void {
    const steps = this.clipboardService.paste(this.project.id, 'symbolSteps');
    if (steps != null) {
      steps.forEach(step => {
        step._id = uniqueId();
        if (step.type === 'symbol') {
          step.pSymbol = new ParametrizedSymbol(step.pSymbol);
        } else if (step.type === 'action') {
          step.action = this.actionService.create(step.action);
        }
        this.symbol.steps.push(step);
        this.selectedSteps.addItem(step);
      });
      this.toastService.info(steps.length + ' step[s] pasted from clipboard');
    }
  }

  editStep(step: any): void {
    if (step.type === 'symbol') {
      this.editSymbolStep(step);
    } else {
      this.editActionStep(step);
    }
  }

  editActionStep(step: any): void {
    const modalRef = this.modalService.open(EditActionModalComponent);
    modalRef.componentInstance.action = this.actionService.create(JSON.parse(JSON.stringify(step.action)));
    modalRef.result.then(updatedAction => {
      step.action = updatedAction;
    }).catch(() => {});
  }

  editSymbolStep(step: any): void {
    const modalRef = this.modalService.open(SelectSymbolModalComponent);
    modalRef.result.then((selectedSymbol: AlphabetSymbol) => {
      if (selectedSymbol.id === this.symbol.id) {
        this.toastService.info('A symbol cannot execute itself');
        return;
      }
      step.symbol = ParametrizedSymbol.fromSymbol(selectedSymbol);
    }).catch(() => {});
  }

  openActionCreateModal(): void {
    const modalRef = this.modalService.open(CreateActionModalComponent, {size: 'xl'});
    modalRef.componentInstance.created.subscribe(a => this.addAction(a));
  }

  get parameterizedSymbolSteps(): any[] {
    const pSymbols = this.symbol == null ? [] : this.symbol.steps
      .filter(s => s.type === 'symbol')
      .map(s => s.pSymbol);

    if (this.symbol.inputs.length > 0) {
      const ps = new ParametrizedSymbol();
      ps.outputMappings = this.symbol.inputs.map(i => ({name: i.name, parameter: i}));
      ps.symbol = this.symbol;
      pSymbols.unshift(ps);
    }

    return pSymbols;
  }

  getSymbolPath(symbol: AlphabetSymbol): string {
    return SymbolGroupUtils.getSymbolPath(this.groups, symbol);
  }

  private handleKeyDown(e: KeyboardEvent) {
    if (e.ctrlKey && e.which === 83) {
      e.preventDefault();
      this.saveChanges();
      return false;
    }
  };
}
