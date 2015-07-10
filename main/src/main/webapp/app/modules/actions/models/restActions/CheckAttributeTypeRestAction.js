(function () {
    'use strict';

    angular
        .module('ALEX.actions')
        .factory('CheckAttributeTypeRestAction', CheckAttributeTypeRestActionFactory);

    CheckAttributeTypeRestActionFactory.$inject = ['AbstractAction', 'actionGroupTypes', 'actionTypes'];

    /**
     * The factory for CheckAttributeTypeRestAction
     *
     * @param AbstractAction
     * @param actionGroupTypes
     * @param actionTypes
     * @returns {CheckAttributeTypeRestAction}
     * @constructor
     */
    function CheckAttributeTypeRestActionFactory(AbstractAction, actionGroupTypes, actionTypes) {

        /**
         * Checks if a property of the JSON of a HTTP response has a specific type
         *
         * @param {string} attribute - The JSON property
         * @param {string} jsonType - The Type in {INTEGER,STRING,BOOLEAN,OBJECT}
         * @constructor
         */
        function CheckAttributeTypeRestAction(attribute, jsonType) {
            AbstractAction.call(this, actionTypes[actionGroupTypes.REST].CHECK_ATTRIBUTE_TYPE);
            this.attribute = attribute || null;
            this.jsonType = jsonType || null;
        }

        CheckAttributeTypeRestAction.prototype = Object.create(AbstractAction.prototype);

        /**
         * @returns {string}
         */
        CheckAttributeTypeRestAction.prototype.toString = function () {
            return 'Check the JSON of a HTTP response to have attribute "' + this.attribute + '" to be' + (this.regexp ? ' like ' : ' ') + '"' + this.value + '"';
        };

        return CheckAttributeTypeRestAction;
    }
}());
