(function () {
    'use strict';

    angular
        .module('ALEX.actions')
        .factory('SelectWebAction', SelectWebActionFactory);

    SelectWebActionFactory.$inject = ['ActionService', 'AbstractAction', 'actionGroupTypes', 'actionTypes'];

    /**
     * The factory for SelectWebAction
     *
     * @param ActionService
     * @param AbstractAction
     * @param actionGroupTypes
     * @param actionTypes
     * @returns {SelectWebAction}
     * @constructor
     */
    function SelectWebActionFactory(ActionService, AbstractAction, actionGroupTypes, actionTypes) {

        /**
         * Selects an entry from a select box
         *
         * @param {string} node - The CSS selector of an select element
         * @param {string} value - The value of the select input that should be selected
         * @constructor
         */
        function SelectWebAction(node, value) {
            AbstractAction.call(this, actionTypes[actionGroupTypes.WEB].SELECT);
            this.node = node || null;
            this.value = value || null;
        }

        SelectWebAction.prototype = Object.create(AbstractAction.prototype);

        /**
         * @returns {string}
         */
        SelectWebAction.prototype.toString = function () {
            return 'Select value "' + this.value + '" from select input "' + this.node + '"';
        };

        ActionService.register(actionGroupTypes.WEB, actionTypes[actionGroupTypes.WEB].SELECT, SelectWebAction);

        return SelectWebAction;
    }
}());
