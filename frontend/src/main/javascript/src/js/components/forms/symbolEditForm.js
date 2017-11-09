/**
 * The component to edit a symbols name.
 * @type {{template: string, bindings: {symbolRef: string, onUpdated: string, onAborted: string}, controller: controller, controllerAs: string}}
 */
export const symbolEditFormComponent = {
    templateUrl: `html/components/forms/symbol-edit-form.html`,
    bindings: {
        symbolRef: '=symbol',
        onUpdated: '&',
        onAborted: '&'
    },
    controller: class SymbolEditFormComponent {
        constructor() {
            this.symbol = null;
        }

        $onInit() {
            this.symbol = JSON.parse(JSON.stringify(this.symbolRef));
        }
    },
    controllerAs: 'vm'
};