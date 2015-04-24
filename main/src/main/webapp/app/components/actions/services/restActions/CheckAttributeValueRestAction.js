(function () {
    'use strict';

    angular
        .module('ALEX.actions')
        .factory('CheckAttributeValueRestAction', ['ActionService', 'AbstractAction', 'actionGroupTypes', 'actionTypes',
            function (ActionService, AbstractAction, actionGroupTypes, actionTypes) {

                function CheckAttributeValueRestAction(attribute, value, isRegexp) {
                    AbstractAction.call(this, actionTypes[actionGroupTypes.REST].CHECK_ATTRIBUTE_VALUE);
                    this.attribute = attribute || null;
                    this.value = value || null;
                    this.regexp = isRegexp || false
                }

                CheckAttributeValueRestAction.prototype.toString = function () {
                    return 'Check the JSON of a HTTP response to have attribute "' + this.attribute + '" to be' + (this.regexp ? ' like ' : ' ') + '"' + this.value + '"';
                };

                ActionService.register(actionGroupTypes.REST, actionTypes[actionGroupTypes.REST].CHECK_ATTRIBUTE_VALUE, CheckAttributeValueRestAction);

                return CheckAttributeValueRestAction;
            }])
}());
