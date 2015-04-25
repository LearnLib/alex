(function () {
    'use strict';

    angular
        .module('ALEX.actions')
        .factory('ClickWebAction', ClickWebActionFactory);

    ClickWebActionFactory.$inject = ['ActionService', 'AbstractAction', 'actionGroupTypes', 'actionTypes'];

    /**
     * The factory for ClickWebAction
     *
     * @param ActionService
     * @param AbstractAction
     * @param actionGroupTypes
     * @param actionTypes
     * @returns {ClickWebAction}
     * @constructor
     */
    function ClickWebActionFactory(ActionService, AbstractAction, actionGroupTypes, actionTypes) {

        /**
         * Clicks on an element
         *
         * @param {string} node - The CSS selector of an element
         * @constructor
         */
        function ClickWebAction(node) {
            AbstractAction.call(this, actionTypes[actionGroupTypes.WEB].CLICK);
            this.node = node || null;
        }

        ClickWebAction.prototype = Object.create(AbstractAction.prototype);

        /**
         * @returns {string}
         */
        ClickWebAction.prototype.toString = function () {
            return 'Click on element "' + this.node + '"';
        };

        ActionService.register(actionGroupTypes.WEB, actionTypes[actionGroupTypes.WEB].CLICK, ClickWebAction);

        return ClickWebAction;
    }
}());
