(function () {
    'use strict';

    angular
        .module('ALEX.actions')
        .factory('CheckAttributeExistsRestAction', ['ActionService', 'AbstractAction', 'actionGroupTypes', 'actionTypes',
            function (ActionService, AbstractAction, actionGroupTypes, actionTypes) {

                function CheckAttributeExistsRestAction(attribute) {
                    AbstractAction.call(this, actionTypes[actionGroupTypes.REST].CHECK_ATTRIBUTE_EXISTS);
                    this.attribute = this.attribute = attribute || null;
                }

                CheckAttributeExistsRestAction.prototype.toString = function () {
                    return 'Check if the JSON of a HTTP response has attribute "' + this.attribute + '"';
                };

                ActionService.register(actionGroupTypes.REST, actionTypes[actionGroupTypes.REST].CHECK_ATTRIBUTE_EXISTS, CheckAttributeExistsRestAction);

                return CheckAttributeExistsRestAction;
            }])
}());
