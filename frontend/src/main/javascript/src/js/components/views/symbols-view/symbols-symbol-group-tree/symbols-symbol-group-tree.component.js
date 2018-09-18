import remove from 'lodash/remove';
import {events} from '../../../../constants';
import {AlphabetSymbol} from '../../../../entities/alphabet-symbol';
import {SymbolGroup} from '../../../../entities/symbol-group';

export const symbolsSymbolGroupTreeComponent = {
    template: require('./symbols-symbol-group-tree.component.html'),
    bindings: {
        group: '=',
        selectedSymbols: '=',
        symbols: '=',
        level: '@'
    },
    controllerAs: 'vm',
    controller: class {

        /**
         * Constructor.
         *
         * @param {PromptService} PromptService
         * @param {SymbolGroupResource} SymbolGroupResource
         * @param {ToastService} ToastService
         * @param {SymbolResource} SymbolResource
         * @param {EventBus} EventBus
         * @param $uibModal
         */
        // @ngInject
        constructor(PromptService, SymbolGroupResource, ToastService, SymbolResource, EventBus, $uibModal) {
            this.promptService = PromptService;
            this.symbolGroupResource = SymbolGroupResource;
            this.toastService = ToastService;
            this.symbolResource = SymbolResource;
            this.eventBus = EventBus;
            this.$uibModal = $uibModal;

            /**
             * The symbol group to display.
             * @type {SymbolGroup}
             */
            this.group = null;

            /**
             * If the group is collapsed.
             * @type {boolean}
             */
            this.collapse = false;
        }

        $onInit() {
            this.level = this.level == null ? 0 : parseInt(this.level);
            if (this.level > 0) {
                this.collapse = true;
            }
        }

        /**
         * Deletes the symbol group under edit and closes the modal dialog on success.
         */
        deleteGroup() {
            this.promptService.confirm('Are you sure that you want to delete the group? All symbols will be archived.')
                .then(() => {
                    this.symbolGroupResource.remove(this.group)
                        .then(() => {
                            this.toastService.success(`Group <strong>${this.group.name}</strong> deleted`);
                            this.eventBus.emit(events.GROUP_DELETED, {
                                group: this.group
                            });
                        })
                        .catch(err => {
                            this.toastService.danger(`The group could not be deleted. ${err.data.message}`);
                        });
                });
        }

        /**
         * Opens the modal dialog for moving a group.
         */
        moveGroup() {
            this.$uibModal.open({
                component: 'symbolGroupMoveModal',
                resolve: {
                    group: () => new SymbolGroup(JSON.parse(JSON.stringify(this.group)))
                }
            });
        }

        editGroup() {
            this.$uibModal.open({
                component: 'symbolGroupEditModal',
                resolve: {
                    group: () => new SymbolGroup(JSON.parse(JSON.stringify(this.group)))
                }
            });
        }

        /**
         * Copy a symbol.
         *
         * @param {AlphabetSymbol} symbol
         */
        copySymbol(symbol) {
            const newName = symbol.name + ' - Copy';
            this.promptService.prompt('Enter a name for the new symbol', newName)
                .then(name => {
                    const symbolToCreate = symbol.getExportableSymbol();
                    symbolToCreate.name = name;

                    // first create the symbol without actions
                    this.symbolResource.create(symbol.project, symbolToCreate)
                        .then(createdSymbol => {
                            this.group.symbols.push(createdSymbol);
                            this.symbols.push(createdSymbol);
                            this.toastService.success('The symbol has been copied.');
                        })
                        .catch(err => this.toastService.danger(`The symbol could not be created. ${err.data.message}`));
                });
        }

        /**
         * Deletes a single symbol from the server and from the scope if the deletion was successful.
         *
         * @param {AlphabetSymbol} symbol - The symbol to be deleted.
         */
        deleteSymbol(symbol) {
            this.symbolResource.remove(symbol)
                .then(() => {
                    this.toastService.success('Symbol <strong>' + symbol.name + '</strong> deleted');
                    remove(this.group.symbols, {id: symbol.id});
                    this.selectedSymbols.unselect(symbol);
                })
                .catch(err => {
                    this.toastService.danger(`The symbol could not be deleted. ${err.data.message}`);
                });
        }
    }
};
