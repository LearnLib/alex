import _ from 'lodash';
import {events} from '../../constants';
import {Symbol} from '../../entities/Symbol';

/**
 * The controller that handles the page for managing all actions of a symbol. The symbol whose actions should be
 * manages has to be defined in the url by its id.
 */
// @ngInject
class SymbolsActionsViewComponent {

    /**
     * Constructor
     * @param $scope
     * @param $stateParams
     * @param SymbolResource
     * @param SessionService
     * @param ToastService
     * @param ErrorService
     * @param ActionService
     * @param ClipboardService
     * @param $state
     * @param PromptService
     * @param EventBus
     * @param dragulaService
     */
    constructor($scope, $stateParams, SymbolResource, SessionService, ToastService, ErrorService,
                ActionService, ClipboardService, $state, PromptService, EventBus, dragulaService) {

        this.SymbolResource = SymbolResource;
        this.ToastService = ToastService;
        this.ActionService = ActionService;
        this.ClipboardService = ClipboardService;

        /**
         * The project that is stored in the session
         * @type {Project}
         */
        this.project = SessionService.getProject();

        /**
         * The symbol whose actions are managed
         * @type {Symbol|null}
         */
        this.symbol = null;

        /**
         * The list of selected actions
         * @type {Object[]}
         */
        this.selectedActions = [];

        /**
         * Whether there are unsaved changes to the symbol
         * @type {boolean}
         */
        this.hasChanged = false;

        // load all actions from the symbol
        // redirect to an error page when the symbol from the url id cannot be found
        this.SymbolResource.get(this.project.id, $stateParams.symbolId)
            .then(symbol => {

                // create unique ids for actions so that they can be found
                symbol.actions.forEach(action => {
                    action._id = _.uniqueId();
                });

                // add symbol to scope and create a copy in order to revert changes
                this.symbol = symbol;
            })
            .catch(() => {
                ErrorService.setErrorMessage('The symbol with the ID "' + $stateParams.symbolId + "' could not be found");
            });

        // show a confirm dialog if the user leaves the page without having saved changes and
        // redirect to the state that the user was about to go to if he doesn't want to save changes
        const offHandler = $scope.$on('$stateChangeStart', (event, toState) => {
            if (this.hasChanged) {
                event.preventDefault();
                PromptService.confirm('There are unsaved changes. Do you still want to continue and discard them?')
                    .then(() => {
                        offHandler();
                        $state.go(toState);
                    });
            }
        });

        // listen on action created event
        EventBus.on(events.ACTION_CREATED, (evt, data) => {
            this.addAction(data.action);
        }, $scope);

        // listen on action updated event
        EventBus.on(events.ACTION_UPDATED, (evt, data) => {
            this.updateAction(data.action);
        }, $scope);

        // dragula
        dragulaService.options($scope, 'actionList', {
            removeOnSpill: false
        });

        $scope.$on('actionList.drop-model', () => {
            this.hasChanged = true;
        });
    }

    /**
     * Deletes a list of actions
     *
     * @param {Object[]} actions - The actions to be deleted
     */
    deleteActions(actions) {
        if (actions.length > 0) {
            actions.forEach(action => {
                _.remove(this.symbol.actions, {_id: action._id});
            });
            this.ToastService.success('Action' + (actions.length > 1 ? 's' : '') + ' deleted');
            this.hasChanged = true;
        }
    }

    /**
     * Adds a new action to the list of actions of the symbol and gives it a temporary unique id
     *
     * @param {Object} action
     */
    addAction(action) {
        action._id = _.uniqueId();
        this.symbol.actions.push(action);
        this.ToastService.success('Action created');
        this.hasChanged = true;
    }

    /**
     * Updates an existing action
     *
     * @param {Object} updatedAction
     */
    updateAction(updatedAction) {
        const action = this.symbol.actions.find(a => a._id === updatedAction._id);
        _.forIn(action, (v, k) => {
            action[k] = updatedAction[k];
        });
        this.ToastService.success('Action updated');
        this.hasChanged = true;
    }

    /**
     * Saves the changes that were made to the symbol by updating it on the server.
     */
    saveChanges() {

        // make a copy of the symbol
        const symbolToUpdate = new Symbol(this.symbol);

        // update the symbol
        this.SymbolResource.update(symbolToUpdate)
            .then(updatedSymbol => {
                this.symbol.revision = updatedSymbol.revision;
                this.ToastService.success('Symbol <strong>' + updatedSymbol.name + '</strong> updated');
                this.hasChanged = false;
            })
            .catch(response => {
                this.ToastService.danger('<p><strong>Error updating symbol</strong></p>' + response.data.message);
            });
    }

    /**
     * Copies actions to the clipboard
     *
     * @param {Object[]} actions
     */
    copyActions(actions) {
        this.ClipboardService.copy('actions', angular.copy(actions));
        this.ToastService.info(actions.length + ' action[s] copied to clipboard');
    }

    /**
     * Copies actions to the clipboard and removes them from the scope
     *
     * @param {Object[]} actions
     */
    cutActions(actions) {
        this.ClipboardService.cut('actions', angular.copy(actions));
        this.deleteActions(actions);
        this.ToastService.info(actions.length + ' action[s] cut to clipboard');
        this.hasChanged = true;
    }

    /**
     * Pastes the actions from the clipboard to the end of of the action list
     */
    pasteActions() {
        let actions = this.ClipboardService.paste('actions');
        if (actions !== null) {
            actions = actions.map(a => this.ActionService.create(a));
            actions.forEach(action => {
                this.addAction(action);
            });
            this.ToastService.info(actions.length + 'action[s] pasted from clipboard');
            this.hasChanged = true;
        }
    }

    /**
     * Toggles the disabled flag on an action
     *
     * @param {Object} action
     */
    toggleDisableAction(action) {
        action.disabled = !action.disabled;
        this.hasChanged = true;
    }
}

export const symbolsActionsViewComponent = {
    controller: SymbolsActionsViewComponent,
    controllerAs: 'vm',
    templateUrl: 'views/pages/symbols-actions.html'
};