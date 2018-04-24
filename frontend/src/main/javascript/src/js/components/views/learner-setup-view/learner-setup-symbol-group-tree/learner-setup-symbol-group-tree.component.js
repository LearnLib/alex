export const learnerSetupSymbolGroupTreeComponent = {
    template: require('./learner-setup-symbol-group-tree.component.html'),
    bindings: {
        group: '=',
        selectedSymbols: '=',
        resetSymbol: '=',
        level: '@',
        onResetSymbolSelected: '&'
    },
    controllerAs: 'vm',
    controller: class {

        // @ngInject
        constructor() {

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
            if (this.level == null) {
                this.level = 0;
            }

            this.level = parseInt(this.level);
            if (this.level > 0) {
                this.collapse = true;
            }
        }

        resetSymbolSelected(symbol) {
            this.onResetSymbolSelected({symbol});
        }
    }
};
