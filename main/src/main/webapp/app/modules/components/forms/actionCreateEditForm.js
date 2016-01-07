/**
 * The directive that loads an action template by its type. E.g. type: 'web_click' -> load 'web_click.html'
 *
 * Attribute 'action' should contain the action object
 * Attribute 'symbols' should contain the list of symbols so that they are available by the action
 *
 * Use: <action-create-edit-form action="..." symbols="..."></action-create-edit-form>
 * @returns {{scope: {action: string}, template: string}}
 */
class ActionCreateEditForm {

    /** Constructor **/
    constructor() {

        /**
         * The map where actions can store temporary values
         */
        this.map = {};

        /**
         * If the advanced options are visible
         * @type {boolean}
         */
        this.showOptions = false;
    }

    /**
     * Returns the corresponding html template for each action based on its type
     * @returns {*}
     */
    getTemplate() {
        return `views/actions/${this.action.type}.html`;
    }
}

const actionCreateEditForm = {
    bindings: {
        action: '=',
        symbols: '='
    },
    controller: ActionCreateEditForm,
    controllerAs: 'vm',
    template: `
        <div ng-if="vm.action !== null">
            <div ng-include="vm.getTemplate()"></div>
            <hr>
            <p>
                <a href="" ng-click="vm.showOptions = !vm.showOptions">
                    <i class="fa fa-gear fa-fw"></i> Advanced Options
                </a>
            </p>
            <div collapse="!vm.showOptions">
                <div class="checkbox">
                    <label>
                        <input type="checkbox" ng-model="vm.action.negated"> Negate
                    </label>
                </div>
                <div class="checkbox">
                    <label>
                        <input type="checkbox" ng-model="vm.action.ignoreFailure"> Ignore Failure
                    </label>
                </div>
            </div>
        </div>
    `
};

export default actionCreateEditForm;