(function () {
    'use strict';

    angular
        .module('ALEX.actions')
        .factory('FillWebAction', FillWebActionFactory);

    FillWebActionFactory.$inject = ['AbstractAction', 'actionGroupTypes', 'actionTypes'];

    /**
     * The factory for FillWebAction
     *
     * @param AbstractAction
     * @param actionGroupTypes
     * @param actionTypes
     * @returns {FillWebAction}
     * @constructor
     */
    function FillWebActionFactory(AbstractAction, actionGroupTypes, actionTypes) {

        /**
         * Fills an input element with a value
         *
         * @param {string} node - The CSS selector of an element
         * @param {string} value - The value it should be filled with
         * @constructor
         */
        function FillWebAction(node, value) {
            AbstractAction.call(this, actionTypes[actionGroupTypes.WEB].FILL);
            this.node = node || null;
            this.value = value || null
        }

        FillWebAction.prototype = Object.create(AbstractAction.prototype);

        /**
         * @returns {string}
         */
        FillWebAction.prototype.toString = function () {
            return 'Fill element "' + this.node + '" with "' + this.value + '"';
        };

        return FillWebAction;
    }
}());
