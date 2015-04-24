(function () {
    'use strict';

    angular
        .module('ALEX.actions')
        .factory('CheckAttributeTypeRestAction', ['ActionService', 'AbstractAction', 'actionGroupTypes', 'actionTypes',
            function (ActionService, AbstractAction, actionGroupTypes, actionTypes) {

                function CheckAttributeTypeRestAction(attribute, jsonType) {
                    AbstractAction.call(this, actionTypes[actionGroupTypes.REST].CHECK_ATTRIBUTE_TYPE);
                    this.attribute = attribute || null;
                    this.jsonType = jsonType || null;
                }

                CheckAttributeTypeRestAction.prototype.toString = function () {
                    return 'Check the JSON of a HTTP response to have attribute "' + this.attribute + '" to be' + (this.regexp ? ' like ' : ' ') + '"' + this.value + '"';
                };

                ActionService.register(actionGroupTypes.REST, actionTypes[actionGroupTypes.REST].CHECK_ATTRIBUTE_TYPE, CheckAttributeTypeRestAction);

                return CheckAttributeTypeRestAction;
            }])
}());
