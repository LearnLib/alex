(function () {
    'use strict';

    angular
        .module('ALEX.actions')
        .factory('ClearWebAction', ClearWebActionFactory);

    ClearWebActionFactory.$inject = ['ActionService', 'AbstractAction', 'actionGroupTypes', 'actionTypes'];

    /**
     * The factory for ClearWebAction
     *
     * @param ActionService
     * @param AbstractAction
     * @param actionGroupTypes
     * @param actionTypes
     * @returns {ClearWebAction}
     * @constructor
     */
    function ClearWebActionFactory(ActionService, AbstractAction, actionGroupTypes, actionTypes) {

        /**
         * Remove all inputs from an element
         *
         * @param {string} node - The CSS selector of the element
         * @constructor
         */
        function ClearWebAction(node) {
            AbstractAction.call(this, actionTypes[actionGroupTypes.WEB].CLEAR);
            this.node = node || null;
        }

        ClearWebAction.prototype = Object.create(AbstractAction.prototype);

        /**
         * @returns {string}
         */
        ClearWebAction.prototype.toString = function () {
            return 'Clear element "' + this.node + '"';
        };

        ActionService.register(actionGroupTypes.WEB, actionTypes[actionGroupTypes.WEB].CLEAR, ClearWebAction);

        return ClearWebAction;
    }
}());
