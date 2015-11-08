(function () {
    'use strict';

    angular
        .module('ALEX.entities')
        .factory('SelectWebAction', factory);

    /**
     * @param AbstractAction
     * @returns {SelectWebAction}
     */
    // @ngInject
    function factory(AbstractAction) {

        /**
         * Selects an entry from a select box
         *
         * @param {string} node - The CSS selector of an select element
         * @param {string} value - The value of the select input that should be selected
         * @param {string} selectBy - The type the option is selected by {'TEXT', 'VALUE', 'INDEX'}
         * @constructor
         */
        function SelectWebAction(node, value, selectBy) {
            AbstractAction.call(this, SelectWebAction.type);
            this.node = node || '';
            this.value = value || '';
            this.selectBy = selectBy || 'TEXT';
        }

        SelectWebAction.prototype = Object.create(AbstractAction.prototype);

        /**
         * @returns {string}
         */
        SelectWebAction.prototype.toString = function () {
            return 'Select value "' + this.value + '" from select input "' + this.node + '"';
        };

        SelectWebAction.type = 'web_select';

        return SelectWebAction;
    }
}());
