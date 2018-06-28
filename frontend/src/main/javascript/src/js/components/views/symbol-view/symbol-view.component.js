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

import remove from 'lodash/remove';
import uniqueId from 'lodash/uniqueId';
import {AlphabetSymbol} from '../../../entities/alphabet-symbol';
import {ParametrizedSymbol} from '../../../entities/parametrized-symbol';
import {Selectable} from '../../../utils/selectable';

/**
 * The controller that handles the page for managing all actions of a symbol. The symbol whose actions should be
 * manages has to be defined in the url by its id.
 */
class SymbolViewComponent {

    /**
     * Constructor.
     *
     * @param $scope
     * @param $stateParams
     * @param {SymbolResource} SymbolResource
     * @param {SessionService} SessionService
     * @param {ToastService} ToastService
     * @param {ActionService} ActionService
     * @param {ClipboardService} ClipboardService
     * @param $state
     * @param {ActionRecorderService} ActionRecorderService
     * @param dragulaService
     * @param $uibModal
     * @param {SymbolGroupResource} SymbolGroupResource
     */
    // @ngInject
    constructor($scope, $stateParams, SymbolResource, SessionService, ToastService, ActionService, ClipboardService,
                $state, dragulaService, ActionRecorderService, $uibModal, SymbolGroupResource) {
        this.SymbolResource = SymbolResource;
        this.ToastService = ToastService;
        this.ActionService = ActionService;
        this.ClipboardService = ClipboardService;
        this.ActionRecorderService = ActionRecorderService;
        this.$uibModal = $uibModal;
        this.SymbolGroupResource = SymbolGroupResource;

        /**
         * The project that is stored in the session.
         * @type {Project}
         */
        this.project = SessionService.getProject();

        /**
         * The symbol whose actions are managed.
         * @type {AlphabetSymbol|null}
         */
        this.symbol = null;

        /**
         * All symbol groups
         * @type {SymbolGroup[]}
         */
        this.groups = [];

        /**
         * The selected actions.
         * @type {Selectable}
         */
        this.selectedSteps = null;

        // load all actions from the symbol
        // redirect to an error page when the symbol from the url id cannot be found
        this.SymbolResource.get(this.project.id, $stateParams.symbolId)
            .then(symbol => {
                this.symbol = symbol;
                this.symbol.steps.forEach(step => step._id = uniqueId());
                this.selectedSteps = new Selectable(this.symbol.steps, '_id');
            })
            .catch(() => {
                $state.go('error', {message: `The symbol with the ID "${$stateParams.symbolId}" could not be found`});
            });

        this.SymbolGroupResource.getAll(this.project.id, true)
            .then(groups => this.groups = groups);

        const keyDownHandler = (e) => {
            if (e.ctrlKey && e.which === 83) {
                e.preventDefault();
                this.saveChanges();
                return false;
            }
        };

        document.addEventListener('keydown', keyDownHandler);

        dragulaService.options($scope, 'actionList', {
            removeOnSpill: false,
            mirrorContainer: document.createElement('div')
        });

        $scope.$on('$destroy', () => {
            dragulaService.destroy($scope, 'actionList');
            document.removeEventListener('keydown', keyDownHandler);
        });
    }

    /**
     * Deletes a list of actions.
     *
     * @param {Object[]} steps - The actions to be deleted.
     */
    deleteSteps(steps) {
        if (steps.length > 0) {
            steps.forEach(step => {
                remove(this.symbol.steps, {_id: step._id});
            });
            this.selectedSteps.unselectMany(steps);
        }
    }

    deleteSelectedSteps() {
        this.deleteSteps(this.selectedSteps.getSelected());
    }

    editSelectedAction() {
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
     * @param {Action} action The action to add.
     */
    addAction(action) {
        this.symbol.steps.push({
            type: 'action',
            action: this.ActionService.create(JSON.parse(JSON.stringify(action)))
        });
    }

    /**
     * Adds a new action to the list of actions of the symbol and gives it a temporary unique id.
     */
    addSymbolStep() {
        this.$uibModal.open({
            component: 'symbolSelectModal',
            resolve: {
                groups: () => this.groups
            }
        }).result.then(symbol => {
            if (symbol.id === this.symbol.id) {
                this.ToastService.info('A symbol cannot execute itself');
                return;
            }

            this.symbol.steps.push({
                type: 'symbol',
                pSymbol: ParametrizedSymbol.fromSymbol(symbol)
            });
        });
    }

    /**
     * Adds new actions to the symbol.
     *
     * @param {Action[]} actions
     */
    addActions(actions) {
        actions.forEach(action => this.symbol.actions.push(action));
    }

    /**
     * Deletes a symbol step.
     *
     * @param {number} $index The index of the step to delete.
     */
    deleteStep($index) {
        this.symbol.steps.splice($index, 1);
    }

    /**
     * Saves the changes that were made to the symbol by updating it on the server.
     */
    saveChanges() {
        // make a copy of the symbol
        const symbolToUpdate = this.symbol.toJson();
        symbolToUpdate.steps.forEach(step => delete step._id);

        // update the symbol
        return this.SymbolResource.update(symbolToUpdate)
            .then(updatedSymbol => {
                this.ToastService.success('Symbol <strong>' + updatedSymbol.name + '</strong> updated');
                this.symbol = updatedSymbol;
                this.symbol.steps.forEach(step => step._id = uniqueId());
                this.selectedSteps = new Selectable(this.symbol.steps, '_id');
            })
            .catch(response => {
                this.ToastService.danger('<p><strong>Error updating symbol</strong></p>' + response.data.message);
            });
    }

    /** Copies actions to the clipboard. */
    copySelectedSteps() {
        let steps = this.selectedSteps.getSelected();
        if (steps.length > 0) {
            steps = steps.map(AlphabetSymbol.stepsToJson);
            steps.forEach(step => {
                delete step._id;
            });
            this.ClipboardService.copy('symbolSteps', steps);
            this.ToastService.info(steps.length + ' steps copied to clipboard');
        }
    }

    copyStep(step) {
        const s = AlphabetSymbol.stepsToJson(step);
        delete s._id;

        this.ClipboardService.copy('symbolSteps', [s]);
        this.ToastService.info('The action has been copied to the clipboard.');
    }

    /** Copies actions to the clipboard and removes them from the scope. */
    cutSelectedSteps() {
        let steps = this.selectedSteps.getSelected();
        if (steps.length > 0) {
            const cpy = steps.map(AlphabetSymbol.stepsToJson);
            cpy.forEach(step => {
                delete step._id;
            });
            this.ClipboardService.cut('symbolSteps', cpy);
            this.deleteSteps(steps);
            this.ToastService.info(steps.length + ' steps cut to clipboard');
        }
    }

    cutStep(step) {
        const s = AlphabetSymbol.stepsToJson(step);
        delete s._id;

        this.ClipboardService.cut('symbolSteps', [s]);
        this.deleteSteps([step]);
        this.ToastService.info('The action has been copied to the clipboard.');
    }

    /**
     * Pastes the actions from the clipboard to the end of of the action list.
     */
    pasteSteps() {
        let steps = this.ClipboardService.paste('symbolSteps');
        if (steps != null) {
            steps.forEach(step => {
                step._id = uniqueId();
                if (step.type === 'symbol') {
                    step.pSymbol = new ParametrizedSymbol(step.pSymbol);
                } else if (step.type === 'action') {
                    step.action = this.ActionService.create(step.action);
                }
                this.symbol.steps.push(step);
            });
            this.ToastService.info(steps.length + ' step[s] pasted from clipboard');
        }
    }

    openRecorder() {
        this.ActionRecorderService.open()
            .then(actions => this.addActions(actions));
    }

    /**
     * Toggles the disabled flag on an action.
     *
     * @param {Object} step - The step to enable or disable.
     */
    toggleDisableAction(step) {
        step.disabled = !step.disabled;
    }

    editActionStep(step) {
        this.$uibModal.open({
            component: 'actionEditModal',
            resolve: {
                modalData: () => ({
                    action: this.ActionService.create(JSON.parse(JSON.stringify(step.action)))
                })
            }
        }).result.then(updatedAction => {
            step.action = updatedAction;
        });
    }

    editSymbolStep(step) {
        this.$uibModal.open({
            component: 'symbolSelectModal',
            resolve: {
                groups: () => this.groups
            }
        }).result.then(selectedSymbol => {
            if (selectedSymbol.id === this.symbol.id) {
                this.ToastService.info('A symbol cannot execute itself');
                return;
            }

            step.symbol = ParametrizedSymbol.fromSymbol(selectedSymbol);
        });
    }
}

export const symbolViewComponent = {
    template: require('./symbol-view.component.html'),
    controllerAs: 'vm',
    controller: SymbolViewComponent
};
