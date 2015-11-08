(function () {
    'use strict';

    angular
        .module('ALEX.entities')
        .factory('CheckAttributeValueRestAction', factory);

    /**
     * @param AbstractAction
     * @returns {CheckAttributeValueRestAction}
     */
    // @ngInject
    function factory(AbstractAction) {

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
            AbstractAction.call(this, CheckAttributeValueRestAction.type);
            this.attribute = attribute || null;
            this.value = value || null;
            this.regexp = isRegexp || false
        }

        CheckAttributeValueRestAction.prototype = Object.create(AbstractAction.prototype);

        /**
         * @returns {string}
         */
        CheckAttributeValueRestAction.prototype.toString = function () {
            if (this.regexp) {
                return 'Check if JSON attribute "' + this.attribute + '" matches "' + this.value + '"';
            } else {
                return 'Check JSON attribute "' + this.attribute + '" to equal "' + this.value + '"';
            }
        };

        CheckAttributeValueRestAction.type = 'rest_checkAttributeValue';

        return CheckAttributeValueRestAction;
    }
}());
