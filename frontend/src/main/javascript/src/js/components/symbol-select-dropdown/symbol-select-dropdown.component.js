export const symbolSelectDropdownComponent = {
    template: require('./symbol-select-dropdown.component.html'),
    bindings: {
        groups: '=',
        onSymbolSelected: '&',
        variant: '@',
    },
    controllerAs: 'vm',
    controller: class SymbolSelectDropdownComponent {

        constructor() {
            this.selectedSymbol = null;
            this.showMenu = false;
        }

        handleSymbolSelected(symbol) {
            this.selectedSymbol = symbol;
            this.showMenu = false;
            this.onSymbolSelected({symbol});
        }

        enableSelection() {
            this.showMenu = !this.showMenu;
        }
    }
};
