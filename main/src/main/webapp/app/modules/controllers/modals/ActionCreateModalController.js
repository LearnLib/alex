import {events} from '../../constants';

/** The controller for the modal dialog that handles the creation of a new action. */
// @ngInject
class ActionCreateModalController {

    /**
     * Constructor
     * @param $modalInstance
     * @param ActionService
     * @param SymbolResource
     * @param SessionService
     * @param EventBus
     */
    constructor($modalInstance, ActionService, SymbolResource, SessionService, EventBus) {
        this.$modalInstance = $modalInstance;
        this.ActionService = ActionService;
        this.EventBus = EventBus;

        const project = SessionService.getProject();

        /**
         * The model for the new action
         * @type {null|Object}
         */
        this.action = null;

        /**
         * All symbols of the project
         * @type {Symbol[]}
         */
        this.symbols = [];

        // get all symbols
        SymbolResource.getAll(project.id).then(symbols => {
            this.symbols = symbols;
        });
    }

    /**
     * Creates a new instance of an Action by a type that was clicked in the modal dialog.
     * @param {string} type - The type of the action that should be created
     */
    selectNewActionType(type) {
        this.action = this.ActionService.createFromType(type);
    }

    /** Closes the modal dialog an passes the created action back to the handle that called the modal */
    createAction() {
        this.EventBus.emit(events.ACTION_CREATED, {action: this.action});
        this.$modalInstance.dismiss();
    }

    /** Creates a new action in the background without closing the dialog */
    createActionAndContinue() {
        this.EventBus.emit(events.ACTION_CREATED, {action: this.action});
        this.action = null;
    }

    /** Closes the modal dialog without passing any data */
    closeModal() {
        this.$modalInstance.dismiss();
    }
}

export default ActionCreateModalController;