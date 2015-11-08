(function () {
    'use strict';

    angular
        .module('ALEX.entities')
        .factory('SetVariableByJsonAttributeGeneralAction', factory);

    /**
     * @param AbstractAction
     * @returns {SetVariableByJsonAttributeGeneralAction}
     */
    function factory(AbstractAction) {

        /**
         * Extracts the value of a JSON object from a HTTP response and saves it into a variable
         *
         * @param {string} name - The name of the variable
         * @param {string} jsonAttribute - The JSON property
         * @constructor
         */
        function SetVariableByJsonAttributeGeneralAction(name, jsonAttribute) {
            AbstractAction.call(this, SetVariableByJsonAttributeGeneralAction.type);
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

        SetVariableByJsonAttributeGeneralAction.type = 'setVariableByJSON';

        return SetVariableByJsonAttributeGeneralAction;
    }
}());
