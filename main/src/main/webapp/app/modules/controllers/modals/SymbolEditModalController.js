import {events} from '../../constants';
import {Symbol} from '../../entities/Symbol';

/**
 * Handles the behaviour of the modal to edit an existing symbol and updates the edited symbol on the server.
 */
// @ngInject
class SymbolEditModalController {

    /**
     * Constructor
     * @param $modalInstance
     * @param modalData
     * @param SymbolResource
     * @param ToastService
     * @param EventBus
     */
    constructor($modalInstance, modalData, SymbolResource, ToastService, EventBus) {
        this.$modalInstance = $modalInstance;
        this.modalData = modalData;
        this.SymbolResource = SymbolResource;
        this.ToastService = ToastService;
        this.EventBus = EventBus;

        /**
         * The symbol to edit
         * @type {Symbol}
         */
        this.symbol = modalData.symbol;

        /**
         * A copy of the old symbol
         * @type {Symbol}
         */
        this.symbolCopy = new Symbol(modalData.symbol);

        /**
         * The error message that is displayed when update fails
         * @type {null|string}
         */
        this.errorMsg = null;
    }

    /** Make a request to the API in order to update the symbol. Close the modal on success. */
    updateSymbol() {
        this.errorMsg = null;

        // do not update on server
        if (angular.isDefined(this.modalData.updateOnServer) && !this.modalData.updateOnServer) {
            this.EventBus.emit(events.SYMBOL_UPDATED, {
                newSymbol: this.symbol,
                oldSymbol: this.symbolCopy
            });
            this.$modalInstance.dismiss();
            return;
        }

        // update the symbol and close the modal dialog on success with the updated symbol
        this.SymbolResource.update(this.symbol)
            .then(updatedSymbol => {
                this.ToastService.success('Symbol updated');
                this.EventBus.emit(events.SYMBOL_UPDATED, {symbol: updatedSymbol});
                this.$modalInstance.dismiss();
            })
            .catch(response => {
                this.errorMsg = response.data.message;
            })
    };

    /** Close the modal dialog */
    close() {
        this.$modalInstance.dismiss();
    }
}

export default SymbolEditModalController;