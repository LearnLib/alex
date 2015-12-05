import {events} from '../../constants';
import {SymbolFormModel} from '../../entities/Symbol';

/** The controller for the modal window to create a new symbol */
// @ngInject
class SymbolCreateModalController {

    /**
     * Constructor
     * @param $modalInstance
     * @param SymbolResource
     * @param SymbolGroupResource
     * @param ToastService
     * @param SessionService
     * @param EventBus
     */
    constructor($modalInstance, SymbolResource, SymbolGroupResource, ToastService, SessionService, EventBus) {
        this.$modalInstance = $modalInstance;
        this.SymbolResource = SymbolResource;
        this.ToastService = ToastService;
        this.EventBus = EventBus;

        /**
         * The project that is in the session
         * @type {Project}
         */
        this.project = SessionService.project.get();

        /**
         * The model of the symbol that will be created
         * @type {SymbolFormModel}
         */
        this.symbol = new SymbolFormModel();

        /**
         * The list of available symbol groups where the new symbol could be created in
         * @type {SymbolGroup[]}
         */
        this.groups = [];

        /**
         * The symbol group that is selected
         * @type {null|SymbolGroup}
         */
        this.selectedGroup = null;

        /**
         * An error message that can be displayed in the template
         * @type {String|null}
         */
        this.error = null;

        // fetch all symbol groups so that they can be selected in the template
        SymbolGroupResource.getAll(this.project.id).then(groups => {
            this.groups = groups;
        });
    }

    /**
     * Creates a new symbol but does not close the modal windown
     * @returns {*}
     */
    createSymbolAndContinue() {
        this.error = null;

        const group = this.groups.find(g => g.name === this.selectedGroup);

        // attach the new symbol to the default group in case none is specified
        this.symbol.group = group ? group.id : 0;

        return this.SymbolResource.create(this.project.id, this.symbol)
            .then(symbol => {
                this.ToastService.success(`Created symbol "${symbol.name}"`);
                this.EventBus.emit(events.SYMBOL_CREATED, {symbol: symbol});
                this.symbol = new SymbolFormModel();
            })
            .catch(response => {
                this.error = response.data.message;
            });
    }

    /**
     * Makes a request to the API and create a new symbol. If the name of the group the user entered was not found
     * the symbol will be put in the default group with the id 0. Closes the modal on success.
     */
    createSymbol() {
        this.createSymbolAndContinue().then(() => {
            this.$modalInstance.dismiss();
        });
    }

    /**
     * Closes the modal dialog
     */
    close() {
        this.$modalInstance.dismiss();
    }
}

export default SymbolCreateModalController;