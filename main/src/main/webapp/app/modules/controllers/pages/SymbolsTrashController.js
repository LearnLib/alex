import {_} from '../../libraries';
import {Symbol} from '../../entities/Symbol';

/**
 * Lists all deleted symbols, what means the symbols where the property 'visible' == 'hidden'. Handles the recover
 * of these symbols. By default, recovered symbols will be moved in the default group with the id 0.
 */
// @ngInject
class SymbolsTrashController {

    /**
     * Constructor
     * @param SessionService
     * @param SymbolResource
     * @param ToastService
     */
    constructor(SessionService, SymbolResource, ToastService) {
        this.SymbolResource = SymbolResource;
        this.ToastService = ToastService;

        /**
         * The project that is in the session
         * @type {Project}
         */
        this.project = SessionService.project.get();

        /**
         * The list of deleted symbols
         * @type {Symbol[]}
         */
        this.symbols = [];

        /**
         * The list of selected symbols
         * @type {Symbol[]}
         */
        this.selectedSymbols = [];

        // fetch all deleted symbols and save them in scope
        this.SymbolResource.getAll(this.project.id, true).then(symbols => {
            this.symbols = symbols;
        });
    }

    /**
     * Recovers a deleted symbol by calling the API and removes the recovered symbol from the symbol list on success
     * @param {Symbol} symbol - The symbol that should be recovered from the trash
     */
    recoverSymbol(symbol) {
        this.SymbolResource.recover(symbol)
            .success(() => {
                this.ToastService.success('Symbol ' + symbol.name + ' recovered');
                _.remove(this.symbols, {id: symbol.id});
            })
            .catch(response => {
                ToastService.danger('<p><strong>Error recovering symbol ' + symbol.name + '!</strong></p>' + response.data.message);
            })
    }

    /** Recovers all symbols that were selected and calls $scope.recoverSymbol for each one */
    recoverSelectedSymbols() {
        if (this.selectedSymbols.length > 0) {
            this.SymbolResource.recoverMany(this.selectedSymbols)
                .success(() => {
                    this.ToastService.success('Symbols recovered');
                    this.selectedSymbols.forEach(symbol => {
                        _.remove(this.symbols, {id: symbol.id})
                    });
                    this.selectedSymbols = [];
                })
                .catch(response => {
                    ToastService.danger('<p><strong>Error recovering symbols!</strong></p>' + response.data.message);
                })
        }
    }
}

export default SymbolsTrashController;