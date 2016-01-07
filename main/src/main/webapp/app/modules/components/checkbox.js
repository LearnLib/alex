const PROPERTY_NAME = '_selected';

/**
 * The controller of the checkbox
 * Use: <checkbox model="..."></checkbox> where
 * 'model' should be an object
 */
class Checkbox {

    /** select the item given via the model attribute */
    toggleSelectItem() {
        if (this.model) {
            this.model[PROPERTY_NAME] = !this.model[PROPERTY_NAME];
        }
    }
}

const checkbox = {
    bindings: {
        model: '='
    },
    controller: Checkbox,
    controllerAs: 'vm',
    template: `
        <span class="alx-checkbox" ng-click="vm.toggleSelectItem()">
            <i class="fa fa-fw" ng-class="vm.model._selected ? 'fa-check-square-o':'fa-square-o'"></i>
        </span>
    `
};

/**
 * The controller of the checkbox for selecting multiple items
 * Use: <checkbox-multiple model="..." model-fn="..."></checkbox-multiple> where
 * 'model' should be a list of objects
 * 'modeFn' should be a function that returns a list of objects
 * Only one attribute should be given at a time
 */
class CheckboxMultiple {

    /** Constructor */
    constructor() {

        /**
         * The status of the items
         * @type {boolean}
         */
        this.checked = false;
    }

    /** Selects or deselects all items */
    toggleSelectItems() {
        this.checked = !this.checked;

        if (this.model) {
            this.model.forEach(item => item[PROPERTY_NAME] = this.checked);
        } else if (this.modelFn) {
            const items = this.modelFn();
            items.forEach(item => item[PROPERTY_NAME] = this.checked);
        }
    }
}

const checkboxMultiple = {
    bindings: {
        model: '=',
        modelFn: '&'
    },
    controller: CheckboxMultiple,
    controllerAs: 'vm',
    template: `
        <span class="alx-checkbox" ng-click="vm.toggleSelectItems()">
            <i class="fa fa-fw" ng-class="vm.checked ? 'fa-check-square-o' : 'fa-square-o'"></i>
        </span>
    `
};

export {checkbox, checkboxMultiple};