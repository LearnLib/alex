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

import * as remove from 'lodash/remove';
import * as uniqueId from 'lodash/uniqueId';
import { AlphabetSymbol } from '../../../entities/alphabet-symbol';
import { ParametrizedSymbol } from '../../../entities/parametrized-symbol';
import { ClipboardMode, ClipboardService } from '../../../services/clipboard.service';
import { Selectable } from '../../../utils/selectable';
import { IScope } from 'angular';
import { SymbolResource } from '../../../services/resources/symbol-resource.service';
import { ProjectService } from '../../../services/project.service';
import { ToastService } from '../../../services/toast.service';
import { ActionService } from '../../../services/action.service';
import { SymbolGroupResource } from '../../../services/resources/symbol-group-resource.service';
import { SymbolGroup } from '../../../entities/symbol-group';
import { Project } from '../../../entities/project';
import { Action } from '../../../entities/actions/action';

/**
 * The controller that handles the page for managing all actions of a symbol. The symbol whose actions should be
 * manages has to be defined in the url by its id.
 */
class SymbolViewComponent {

  /** The symbol whose actions are managed. */
  public symbol: AlphabetSymbol;

  /** All symbol groups. */
  public groups: SymbolGroup[];

  /** The selected actions. */
  public selectedSteps: Selectable<any>;

  /**
   * Constructor.
   *
   * @param $scope
   * @param $stateParams
   * @param symbolResource
   * @param projectService
   * @param toastService
   * @param actionService
   * @param clipboardService
   * @param $state
   * @param dragulaService
   * @param $uibModal
   * @param symbolGroupResource
   */
  /* @ngInject */
  constructor(private $scope: IScope,
              private $stateParams: any,
              private symbolResource: SymbolResource,
              private projectService: ProjectService,
              private toastService: ToastService,
              private actionService: ActionService,
              private clipboardService: ClipboardService,
              private $state: any,
              private dragulaService: any,
              private $uibModal: any,
              private symbolGroupResource: SymbolGroupResource) {

    this.symbol = null;
    this.groups = [];
    this.selectedSteps = null;

    // load all actions from the symbol
    // redirect to an error page when the symbol from the url id cannot be found
    this.symbolResource.get(this.project.id, $stateParams.symbolId)
      .then(symbol => {
        this.symbol = symbol;
        this.symbol.steps.forEach(step => step._id = uniqueId());
        this.selectedSteps = new Selectable(this.symbol.steps, '_id');
      })
      .catch(() => {
        this.$state.go('error', {message: `The symbol with the ID "${$stateParams.symbolId}" could not be found`});
      });

    this.symbolGroupResource.getAll(this.project.id)
      .then(groups => this.groups = groups);

    const keyDownHandler = (e) => {
      if (e.ctrlKey && e.which === 83) {
        e.preventDefault();
        this.saveChanges();
        return false;
      }
    };

    document.addEventListener('keydown', keyDownHandler);

    this.dragulaService.options(this.$scope, 'actionList', {
      removeOnSpill: false,
      mirrorContainer: document.createElement('div')
    });

    this.$scope.$on('$destroy', () => {
      this.dragulaService.destroy(this.$scope, 'actionList');
      document.removeEventListener('keydown', keyDownHandler);
    });
  }

  /**
   * Deletes a list of actions.
   *
   * @param steps The actions to be deleted.
   */
  deleteSteps(steps: any): void {
    if (steps.length > 0) {
      steps.forEach(step => {
        remove(this.symbol.steps, {_id: step._id});
      });
      this.selectedSteps.unselectMany(steps);
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
    this.symbol.steps.push({
      _id: uniqueId(),
      type: 'action',
      errorOutput: null,
      negated: false,
      ignoreFailure: false,
      action: this.actionService.create(JSON.parse(JSON.stringify(action)))
    });
  }

  /**
   * Adds a new action to the list of actions of the symbol and gives it a temporary unique id.
   */
  addSymbolStep(): void {
    this.$uibModal.open({
      component: 'symbolSelectModal'
    }).result.then(symbol => {
      if (symbol.id === this.symbol.id) {
        this.toastService.info('A symbol cannot execute itself');
        return;
      }

      this.symbol.steps.push({
        _id: uniqueId(),
        type: 'symbol',
        errorOutput: null,
        negated: false,
        ignoreFailure: false,
        pSymbol: ParametrizedSymbol.fromSymbol(symbol)
      });
    });
  }

  /**
   * Deletes a symbol step.
   *
   * @param $index The index of the step to delete.
   */
  deleteStep($index: number): void {
    this.symbol.steps.splice($index, 1);
  }

  /**
   * Saves the changes that were made to the symbol by updating it on the server.
   */
  saveChanges() {
    const symbolToUpdate = this.symbol.toJson();
    symbolToUpdate.steps.forEach(s => delete s._id);

    return this.symbolResource.update(symbolToUpdate)
      .then(updatedSymbol => {
        this.toastService.success('Symbol <strong>' + updatedSymbol.name + '</strong> updated');
        this.symbol = updatedSymbol;
        this.symbol.steps.forEach(step => step._id = uniqueId());
        this.selectedSteps = new Selectable(this.symbol.steps, '_id');
      })
      .catch(response => {
        this.toastService.danger('<p><strong>Error updating symbol</strong></p>' + response.data.message);
      });
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
    let steps = this.selectedSteps.getSelected();
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
    let steps = this.clipboardService.paste(this.project.id, 'symbolSteps');
    if (steps != null) {
      steps.forEach(step => {
        step._id = uniqueId();
        if (step.type === 'symbol') {
          step.pSymbol = new ParametrizedSymbol(step.pSymbol);
        } else if (step.type === 'action') {
          step.action = this.actionService.create(step.action);
        }
        this.symbol.steps.push(step);
      });
      this.toastService.info(steps.length + ' step[s] pasted from clipboard');
    }
  }

  /**
   * Toggles the disabled flag on an action.
   *
   * @param step The step to enable or disable.
   */
  toggleDisableAction(step: any): void {
    step.disabled = !step.disabled;
  }

  editActionStep(step: any): void {
    this.$uibModal.open({
      component: 'actionEditModal',
      resolve: {
        modalData: () => ({
          action: this.actionService.create(JSON.parse(JSON.stringify(step.action)))
        })
      }
    }).result.then(updatedAction => {
      step.action = updatedAction;
    });
  }

  editSymbolStep(step: any): void {
    this.$uibModal.open({
      component: 'symbolSelectModal'
    }).result.then(selectedSymbol => {
      if (selectedSymbol.id === this.symbol.id) {
        this.toastService.info('A symbol cannot execute itself');
        return;
      }

      step.symbol = ParametrizedSymbol.fromSymbol(selectedSymbol);
    });
  }

  openActionCreateModal(): void {
    this.$uibModal.open({
      component: 'actionCreateModal',
      size: 'lg',
      resolve: {
        onCreated: () => (a) => this.addAction(a)
      }
    });
  }

  get project(): Project {
    return this.projectService.store.currentProject;
  }
}

export const symbolViewComponent = {
  template: require('./symbol-view.component.html'),
  controllerAs: 'vm',
  controller: SymbolViewComponent
};
