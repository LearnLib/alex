import uniqueId from 'lodash/uniqueId';
import {AlphabetSymbol} from '../../entities/AlphabetSymbol';

/**
 * The component for the symbols import modal window.
 */
export class SymbolsImportModalComponent {

    /**
     * Constructor.
     *
     * @param {SymbolResource} SymbolResource
     * @param {SessionService} SessionService
     * @param {ToastService} ToastService
     */
    // @ngInject
    constructor(SymbolResource, SessionService, ToastService) {
        this.SymbolResource = SymbolResource;
        this.ToastService = ToastService;

        /**
         * The current project.
         * @type {Project}
         */
        this.project = SessionService.getProject();

        /**
         * The list of symbols to import.
         * @type {AlphabetSymbol[]}
         */
        this.symbols = [];

        this.symbolToEdit = null;
    }

    /**
     * Load the symbols from a JSON file.
     *
     * @param {string} data - The serialized symbols.
     */
    fileLoaded(data) {
        this.symbols = JSON.parse(data).map(s => {
            const symbol = new AlphabetSymbol(s);
            symbol.id = uniqueId();
            return symbol;
        });
    }

    /**
     * Import the symbols and close the modal window on success.
     */
    importSymbols() {
        const symbolsToImport = JSON.parse(JSON.stringify(this.symbols));
        symbolsToImport.forEach(s => delete s.id);

        this.SymbolResource.createMany(this.project.id, symbolsToImport)
            .then(symbols => {
                this.ToastService.success('Symbols imported');
                this.close({$value: symbols});
            })
            .catch(() => {
                this.ToastService.danger('Import failed. It seems at least on symbol already exists');
            });
    }

    /**
     * Updates the name of the symbol to edit.
     *
     * @param {AlphabetSymbol} updatedSymbol - The updated symbol.
     */
    updateSymbol(updatedSymbol) {

        // check if the name already exists
        let symbol = this.symbols.find(s => s.name === updatedSymbol.name);
        if (symbol && symbol.id !== updatedSymbol.id) {
            this.ToastService.danger(`The symbol with the name "${updatedSymbol.name}" already exists.`);
            return;
        }

        // update name
        symbol = this.symbols.find(s => s.id === updatedSymbol.id);
        symbol.name = updatedSymbol.name;
        this.symbolToEdit = null;
    }
}

export const symbolsImportModalComponent = {
    templateUrl: 'html/components/modals/symbols-import-modal.html',
    bindings: {
        dismiss: '&',
        close: '&'
    },
    controller: SymbolsImportModalComponent,
    controllerAs: 'vm'
};

// @ngInject
export function symbolsImportModalHandle($uibModal) {
    return {
        restrict: 'A',
        scope: {
            onImported: '&'
        },
        link(scope, el) {
            el.on('click', () => {
                $uibModal.open({
                    component: 'symbolsImportModal',
                    size: 'lg',
                }).result.then(symbols => {
                    scope.onImported({symbols});
                });
            });
        }
    };
}
