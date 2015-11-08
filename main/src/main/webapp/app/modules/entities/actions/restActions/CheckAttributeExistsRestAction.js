(function () {
    'use strict';

    angular
        .module('ALEX.entities')
        .factory('CheckAttributeExistsRestAction', factory);

    // @ngInject
    function factory(AbstractAction) {

        /**
         * Checks in a HTTP response body that is formatted in JSON if a specific attribute exists.
         * E.g. object.attribute.anotherAttribute
         *
         * @param {string} attribute - A JSON property
         * @constructor
         */
        function CheckAttributeExistsRestAction(attribute) {
            AbstractAction.call(this, CheckAttributeExistsRestAction.type);
            this.attribute = this.attribute = attribute || null;
        }

        CheckAttributeExistsRestAction.prototype = Object.create(AbstractAction.prototype);

        /**
         * @returns {string}
         */
        CheckAttributeExistsRestAction.prototype.toString = function () {
            return 'Check if the JSON of a HTTP response has attribute "' + this.attribute + '"';
        };

        CheckAttributeExistsRestAction.type = 'rest_checkAttributeExists';

        return CheckAttributeExistsRestAction;
    }
}());
