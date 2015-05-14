(function () {
    'use strict';

    angular
        .module('ALEX.actions')
        .factory('CheckAttributeValueRestAction', CheckAttributeValueRestActionFactory);

    CheckAttributeValueRestActionFactory.$inject = ['ActionService', 'AbstractAction', 'actionGroupTypes', 'actionTypes'];

    /**
     * The factory for CheckAttributeValueRestAction
     *
     * @param ActionService
     * @param AbstractAction
     * @param actionGroupTypes
     * @param actionTypes
     * @returns {CheckAttributeValueRestAction}
     * @constructor
     */
    function CheckAttributeValueRestActionFactory(ActionService, AbstractAction, actionGroupTypes, actionTypes) {

        /**
         * Checks if a property of a JSON object in a HTTP response body has a specific value or matches a regular
         * expression
         *
         * @param {string} attribute - The JSON property
         * @param {string} value - The value that is searched for in the property
         * @param {boolean} isRegexp - Whether the value is a regular expression
         * @constructor
         */
        function CheckAttributeValueRestAction(attribute, value, isRegexp) {
            AbstractAction.call(this, actionTypes[actionGroupTypes.REST].CHECK_ATTRIBUTE_VALUE);
            this.attribute = attribute || null;
            this.value = value || null;
            this.regexp = isRegexp || false
        }

        CheckAttributeValueRestAction.prototype = Object.create(AbstractAction.prototype);

        /**
         * @returns {string}
         */
        CheckAttributeValueRestAction.prototype.toString = function () {
            return 'Check the JSON of a HTTP response to have attribute "' + this.attribute + '" to be' + (this.regexp ? ' like ' : ' ') + '"' + this.value + '"';
        };

        ActionService.register(actionGroupTypes.REST, actionTypes[actionGroupTypes.REST].CHECK_ATTRIBUTE_VALUE, CheckAttributeValueRestAction);

        return CheckAttributeValueRestAction;
    }
}());
