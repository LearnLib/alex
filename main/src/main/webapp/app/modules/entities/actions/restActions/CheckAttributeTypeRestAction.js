(function () {
    'use strict';

    angular
        .module('ALEX.entities')
        .factory('CheckAttributeTypeRestAction', factory);

    // @ngInject
    function factory(AbstractAction) {

        /**
         * Checks if a property of the JSON of a HTTP response has a specific type
         *
         * @param {string} attribute - The JSON property
         * @param {string} jsonType - The Type in {INTEGER,STRING,BOOLEAN,OBJECT}
         * @constructor
         */
        function CheckAttributeTypeRestAction(attribute, jsonType) {
            AbstractAction.call(this, CheckAttributeTypeRestAction.type);
            this.attribute = attribute || null;
            this.jsonType = jsonType || null;
        }

        CheckAttributeTypeRestAction.prototype = Object.create(AbstractAction.prototype);

        /**
         * @returns {string}
         */
        CheckAttributeTypeRestAction.prototype.toString = function () {
            return 'Check the JSON attribute "' + this.attribute + '" is type of "' + this.jsonType + '"';
        };

        CheckAttributeTypeRestAction.type = 'rest_checkAttributeType';

        return CheckAttributeTypeRestAction;
    }
}());
