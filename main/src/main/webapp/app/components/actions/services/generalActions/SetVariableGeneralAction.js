(function () {
    'use strict';

    angular
        .module('ALEX.actions')
        .factory('SetVariableGeneralAction', SetVariableGeneralActionFactory);

    SetVariableGeneralActionFactory.$inject = ['ActionService', 'AbstractAction', 'actionGroupTypes', 'actionTypes'];

    /**
     * The factory for SetVariableGeneralAction
     *
     * @param ActionService
     * @param AbstractAction
     * @param actionGroupTypes
     * @param actionTypes
     * @returns {SetVariableGeneralAction}
     * @constructor
     */
    function SetVariableGeneralActionFactory(ActionService, AbstractAction, actionGroupTypes, actionTypes) {

        /**
         * Sets a variable to a specific value and implicitly initializes it if it has not been created before
         *
         * @param {string} name - The name of the variable
         * @param {string} value - The value of the variable
         * @constructor
         */
        function SetVariableGeneralAction(name, value) {
            AbstractAction.call(this, actionTypes[actionGroupTypes.GENERAL].SET_VARIABLE);
            this.name = name || null;
            this.value = value || null;
        }

        SetVariableGeneralAction.prototype = Object.create(AbstractAction.prototype);

        /**
         * @returns {string}
         */
        SetVariableGeneralAction.prototype.toString = function () {
            return 'Set variable "' + this.name + '" to "' + this.value + '"';
        };

        ActionService.register(
            actionGroupTypes.GENERAL,
            actionTypes[actionGroupTypes.GENERAL].SET_VARIABLE,
            SetVariableGeneralAction
        );

        return SetVariableGeneralAction;
    }
}());
