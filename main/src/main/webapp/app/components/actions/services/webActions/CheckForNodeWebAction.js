(function () {
    'use strict';

    angular
        .module('ALEX.actions')
        .factory('CheckForNodeWebAction', CheckForNodeWebActionFactory);

    CheckForNodeWebActionFactory.$inject = ['ActionService', 'AbstractAction', 'actionGroupTypes', 'actionTypes'];

    /**
     * The factory for CheckForNodeWebAction
     *
     * @param ActionService
     * @param AbstractAction
     * @param actionGroupTypes
     * @param actionTypes
     * @returns {CheckForNodeWebAction}
     * @constructor
     */
    function CheckForNodeWebActionFactory(ActionService, AbstractAction, actionGroupTypes, actionTypes) {

        /**
         * Searches for an element with a specific selector in the HTML document
         *
         * @param {string} value - The CSS selector of an element
         * @constructor
         */
        function CheckForNodeWebAction(value) {
            AbstractAction.call(this, actionTypes[actionGroupTypes.WEB].CHECK_FOR_NODE);
            this.value = value || null;
        }

        CheckForNodeWebAction.prototype = Object.create(AbstractAction.prototype);

        /**
         * @returns {string}
         */
        CheckForNodeWebAction.prototype.toString = function () {
            return 'Search for node "' + this.value + '"';
        };

        ActionService.register(actionGroupTypes.WEB, actionTypes[actionGroupTypes.WEB].CHECK_FOR_NODE, CheckForNodeWebAction);

        return CheckForNodeWebAction;
    }
}());
