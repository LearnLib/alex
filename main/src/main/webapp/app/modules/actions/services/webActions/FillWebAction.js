(function () {
    'use strict';

    angular
        .module('ALEX.actions')
        .factory('FillWebAction', FillWebActionFactory);

    FillWebActionFactory.$inject = ['ActionService', 'AbstractAction', 'actionGroupTypes', 'actionTypes'];

    /**
     * The factory for FillWebAction
     *
     * @param ActionService
     * @param AbstractAction
     * @param actionGroupTypes
     * @param actionTypes
     * @returns {FillWebAction}
     * @constructor
     */
    function FillWebActionFactory(ActionService, AbstractAction, actionGroupTypes, actionTypes) {

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

        ActionService.register(actionGroupTypes.WEB, actionTypes[actionGroupTypes.WEB].FILL, FillWebAction);

        return FillWebAction;
    }
}());
