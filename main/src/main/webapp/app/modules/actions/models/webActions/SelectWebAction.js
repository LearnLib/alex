(function () {
    'use strict';

    angular
        .module('ALEX.actions')
        .factory('SelectWebAction', SelectWebActionFactory);

    SelectWebActionFactory.$inject = ['AbstractAction', 'actionGroupTypes', 'actionTypes'];

    /**
     * The factory for SelectWebAction
     *
     * @param AbstractAction
     * @param actionGroupTypes
     * @param actionTypes
     * @returns {SelectWebAction}
     * @constructor
     */
    function SelectWebActionFactory(AbstractAction, actionGroupTypes, actionTypes) {

        /**
         * Selects an entry from a select box
         *
         * @param {string} node - The CSS selector of an select element
         * @param {string} value - The value of the select input that should be selected
         * @param {string} selectBy - The type the option is selected by {'TEXT', 'VALUE', 'INDEX'}
         * @constructor
         */
        function SelectWebAction(node, value, selectBy) {
            AbstractAction.call(this, actionTypes[actionGroupTypes.WEB].SELECT);
            this.node = node || null;
            this.value = value || null;
            this.selectBy = selectBy || 'TEXT';
        }

        SelectWebAction.prototype = Object.create(AbstractAction.prototype);

        /**
         * @returns {string}
         */
        SelectWebAction.prototype.toString = function () {
            return 'Select value "' + this.value + '" from select input "' + this.node + '"';
        };

        return SelectWebAction;
    }
}());
