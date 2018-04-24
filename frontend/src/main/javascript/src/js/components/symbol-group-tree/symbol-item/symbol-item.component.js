export const symbolItemComponent = {
    template: require('./symbol-item.component.html'),
    bindings: {
        symbol: '=',
        selectedSymbols: '=',
        selectable: '='
    },
    transclude: true,
    controllerAs: 'vm',
    controller: class {
    }
};
