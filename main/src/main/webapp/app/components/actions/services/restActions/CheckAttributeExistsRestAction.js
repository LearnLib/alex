(function () {
    'use strict';

    angular
        .module('ALEX.actions')
        .factory('CheckAttributeExistsRestAction', CheckAttributeExistsRestActionFactory);

    CheckAttributeExistsRestActionFactory.$inject = ['ActionService', 'AbstractAction', 'actionGroupTypes', 'actionTypes'];

    /**
     * The factory for CheckAttributeExistsRestAction
     *
     * @param ActionService
     * @param AbstractAction
     * @param actionGroupTypes
     * @param actionTypes
     * @returns {CheckAttributeExistsRestAction}
     * @constructor
     */
    function CheckAttributeExistsRestActionFactory(ActionService, AbstractAction, actionGroupTypes, actionTypes) {

        /**
         * Checks in a HTTP response body that is formatted in JSON if a specific attribute exists.
         * E.g. object.attribute.anotherAttribute
         *
         * @param {string} attribute - A JSON property
         * @constructor
         */
        function CheckAttributeExistsRestAction(attribute) {
            AbstractAction.call(this, actionTypes[actionGroupTypes.REST].CHECK_ATTRIBUTE_EXISTS);
            this.attribute = this.attribute = attribute || null;
        }

        CheckAttributeExistsRestAction.prototype = Object.create(AbstractAction.prototype);

        /**
         * @returns {string}
         */
        CheckAttributeExistsRestAction.prototype.toString = function () {
            return 'Check if the JSON of a HTTP response has attribute "' + this.attribute + '"';
        };

        ActionService.register(
            actionGroupTypes.REST,
            actionTypes[actionGroupTypes.REST].CHECK_ATTRIBUTE_EXISTS,
            CheckAttributeExistsRestAction
        );

        return CheckAttributeExistsRestAction;
    }
}());
