(function () {
    'use strict';

    angular
        .module('ALEX.actions')
        .factory('SetVariableByNodeGeneralAction', SetVariableByNodeGeneralActionFactory);

    SetVariableByNodeGeneralActionFactory.$inject = ['ActionService', 'AbstractAction', 'actionGroupTypes', 'actionTypes'];

    /**
     * The factory for SetVariableByNodeGeneralAction
     *
     * @param ActionService
     * @param AbstractAction
     * @param actionGroupTypes
     * @param actionTypes
     * @returns {SetVariableByNodeGeneralAction}
     * @constructor
     */
    function SetVariableByNodeGeneralActionFactory(ActionService, AbstractAction, actionGroupTypes, actionTypes) {

        /**
         * Extracts the text content value of an element and saves it value in a variable
         *
         * @param {string} name - The name of the variable
         * @param {string} selector - The CSS selector of an element
         * @constructor
         */
        function SetVariableByNodeGeneralAction(name, selector) {
            AbstractAction.call(this, actionTypes[actionGroupTypes.GENERAL].SET_VARIABLE_BY_NODE);
            this.name = name || null;
            this.value = selector || null;
        }

        SetVariableByNodeGeneralAction.prototype = Object.create(AbstractAction.prototype);

        /**
         * @returns {string}
         */
        SetVariableByNodeGeneralAction.prototype.toString = function () {
            return 'Set variable "' + this.name + '" to the value of the element "' + this.value + '"';
        };

        ActionService.register(actionGroupTypes.GENERAL, actionTypes[actionGroupTypes.GENERAL].SET_VARIABLE_BY_NODE, SetVariableByNodeGeneralAction);

        return SetVariableByNodeGeneralAction;
    };
}());
