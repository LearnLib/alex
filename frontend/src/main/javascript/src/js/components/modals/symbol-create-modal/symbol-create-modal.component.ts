/*
 * Copyright 2018 TU Dortmund
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

import {AlphabetSymbol} from '../../../entities/alphabet-symbol';
import {Project} from '../../../entities/project';
import {SymbolGroup} from '../../../entities/symbol-group';
import {ModalComponent} from '../modal.component';
import {SymbolResource} from '../../../services/resources/symbol-resource.service';
import {ToastService} from '../../../services/toast.service';
import {ProjectService} from '../../../services/project.service';
import {IFormController, IPromise} from 'angular';

/**
 * The controller for the modal window to create a new symbol.
 */
export const symbolCreateModalComponent = {
  template: require('./symbol-create-modal.component.html'),
  bindings: {
    dismiss: '&',
    resolve: '='
  },
  controllerAs: 'vm',
  controller: class SymbolCreateModalComponent extends ModalComponent {

    /** The model of the symbol that will be created. */
    public symbol: AlphabetSymbol;

    /** The list of available symbol groups where the new symbol could be created in. */
    public groups: SymbolGroup[];

    /** An error message that can be displayed in the template. */
    public errorMessage: string;

    /** The selected symbol group. */
    public selectedSymbolGroup: SymbolGroup;

    /** The form. */
    public form: IFormController;

    /**
     * Constructor.
     *
     * @param symbolResource
     * @param toastService
     * @param projectService
     */
    // @ngInject
    constructor(private symbolResource: SymbolResource,
                private toastService: ToastService,
                private projectService: ProjectService) {
      super();

      this.symbol = new AlphabetSymbol();
      this.groups = [];
      this.errorMessage = null;
      this.selectedSymbolGroup = null;
      this.form = null;
    }

    $onInit(): void {
      this.groups = this.resolve.groups;
      this.selectedSymbolGroup = this.getDefaultGroup();
      this.symbol.group = this.selectedSymbolGroup.id;
    }

    /**
     * Creates a new symbol but does not close the modal window.
     *
     * @returns {*}
     */
    createSymbolAndContinue(): void {
      this.errorMessage = null;
      this._createSymbol()
        .catch(response => this.errorMessage = response.data.message);
    }

    /**
     * Makes a request to the API and create a new symbol. If the name of the group the user entered was not found
     * the symbol will be put in the default group with the id 0. Closes the modal on success.
     */
    createSymbol(): void {
      this._createSymbol()
        .then(this.dismiss)
        .catch(response => this.errorMessage = response.data.message);
    }

    selectSymbolGroup(group: SymbolGroup): void {
      if (this.selectedSymbolGroup != null && this.selectedSymbolGroup.id === group.id) {
        this.selectedSymbolGroup = this.getDefaultGroup();
      } else {
        this.selectedSymbolGroup = group;
      }
    }

    private getDefaultGroup(): SymbolGroup {
      return this.groups.reduce((acc, curr) => curr.id < acc.id ? curr : acc);
    }

    private _createSymbol(): IPromise<any> {
      this.symbol.group = this.selectedSymbolGroup.id;

      return this.symbolResource.create(this.project.id, this.symbol)
        .then(symbol => {
          this.toastService.success(`Created symbol "${symbol.name}"`);
          this.resolve.onCreated(symbol);
          this.symbol = new AlphabetSymbol();
          this.symbol.group = this.getDefaultGroup().id;

          // set the form to its original state
          this.form.$setPristine();
          this.form.$setUntouched();
        });
    }

    get project(): Project {
      return this.projectService.store.currentProject;
    }
  }
};
