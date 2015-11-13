import {Symbol} from '../../entities/Symbol';

/**
 * The controller that handles the moving of symbols into another group.
 */
// @ngInject
class SymbolMoveModalController {

    /**
     * Constructor
     * @param $modalInstance
     * @param modalData
     * @param SymbolResource
     * @param SymbolGroupResource
     * @param SessionService
     * @param ToastService
     */
    constructor($modalInstance, modalData, SymbolResource, SymbolGroupResource, SessionService, ToastService) {
        this.$modalInstance = $modalInstance;
        this.SymbolResource = SymbolResource;
        this.modalData = modalData;
        this.ToastService = ToastService;

        const project = SessionService.project.get();

        /**
         * The list of symbols that should be moved
         * @type {Symbol[]}
         */
        this.symbols = modalData.symbols;

        /**
         * The list of existing symbol groups
         * @type {SymbolGroup[]}
         */
        this.groups = [];

        /**
         * The symbol group the symbols should be moved into
         * @type {SymbolGroup|null}
         */
        this.selectedGroup = null;

        // fetch all symbolGroups
        SymbolGroupResource.getAll(project.id).then(groups => {
            this.groups = groups;
        })
    }

    /**
     * Moves the symbols into the selected group by changing the group property of each symbol and then batch
     * updating them on the server
     */
    moveSymbols() {
        if (this.selectedGroup !== null) {
            this.symbols.forEach(symbol => {
                symbol.group = this.selectedGroup.id;
            });

            this.SymbolResource.moveMany(this.symbols, this.selectedGroup)
                .success(() => {
                    this.ToastService.success('Symbols move to group <strong>' + this.selectedGroup.name + '</strong>');
                    this.$modalInstance.close({
                        symbols: this.modalData.symbols,
                        group: this.selectedGroup
                    });
                })
                .catch(response => {
                    this.ToastService.danger('<p><strong>Moving symbols failed</strong></p>' + response.data.message);
                })
        }
    }

    /**
     * Selects the group where the symbols should be moved into
     * @param {SymbolGroup} group
     */
    selectGroup(group) {
        this.selectedGroup = this.selectedGroup === group ? null : group;
    }

    /** Close the modal dialog */
    close() {
        this.$modalInstance.dismiss();
    }
}

export default SymbolMoveModalController;