(function () {
    'use strict';

    angular
        .module('ALEX.actions')
        .factory('SetVariableByJsonAttributeGeneralAction', SetVariableByJsonAttributeGeneralActionFactory);

    SetVariableByJsonAttributeGeneralActionFactory.$inject = ['ActionService', 'AbstractAction', 'actionGroupTypes', 'actionTypes'];

    /**
     * The factory for SetVariableByJsonAttributeGeneralAction
     *
     * @param ActionService
     * @param AbstractAction
     * @param actionGroupTypes
     * @param actionTypes
     * @returns {SetVariableByJsonAttributeGeneralAction}
     * @constructor
     */
    function SetVariableByJsonAttributeGeneralActionFactory(ActionService, AbstractAction, actionGroupTypes, actionTypes) {

        /**
         * Extracts the value of a JSON object from a HTTP response and saves it into a variable
         *
         * @param {string} name - The name of the variable
         * @param {string} jsonAttribute - The JSON property
         * @constructor
         */
        function SetVariableByJsonAttributeGeneralAction(name, jsonAttribute) {
            AbstractAction.call(this, actionTypes[actionGroupTypes.GENERAL].SET_VARIABLE_BY_JSON_ATTRIBUTE);
            this.name = name || null;
            this.value = jsonAttribute || null;
        }

        SetVariableByJsonAttributeGeneralAction.prototype = Object.create(AbstractAction.prototype);

        /**
         * @returns {string}
         */
        SetVariableByJsonAttributeGeneralAction.prototype.toString = function () {
            return 'Set variable "' + this.name + '" to the value of the JSON attribute "' + this.value + '"';
        };

        ActionService.register(
            actionGroupTypes.GENERAL,
            actionTypes[actionGroupTypes.GENERAL].SET_VARIABLE_BY_JSON_ATTRIBUTE,
            SetVariableByJsonAttributeGeneralAction
        );

        return SetVariableByJsonAttributeGeneralAction;
    }
}());
