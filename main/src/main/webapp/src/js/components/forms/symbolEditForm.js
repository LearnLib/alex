/**
 * The component to edit a symbols name and abbreviation.
 * @type {{template: string, bindings: {symbolRef: string, onUpdated: string, onAborted: string}, controller: controller, controllerAs: string}}
 */
export const symbolEditFormComponent = {
    template: `
        <form>
            <div class="form-group">
                <label>Name</label>
                <input type="text" class="form-control" required ng-model="vm.symbol.name">
            </div>
            <div class="form-group">
                <label>Abbreviation</label>
                <input type="text" class="form-control" max-length="15" required ng-model="vm.symbol.abbreviation">
            </div>

            <div class="form-group">
                <button class="btn btn-primary btn-sm" ng-click="vm.onUpdated({symbol: vm.symbol})">Update</button>
                <button class="btn btn-default btn-sm" ng-click="vm.onAborted()">Abort</button>
            </div>
        </form>
    `,
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