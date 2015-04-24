(function () {
    'use strict';

    angular
        .module('ALEX.actions')
        .factory('SetVariableByJsonAttributeGeneralAction', ['ActionService', 'AbstractAction', 'actionGroupTypes', 'actionTypes',
            function (ActionService, AbstractAction, actionGroupTypes, actionTypes) {

                function SetVariableByJsonAttributeGeneralAction(name, jsonAttribute) {
                    AbstractAction.call(this, actionTypes[actionGroupTypes.GENERAL].SET_VARIABLE_BY_JSON_ATTRIBUTE);
                    this.name = name || null;
                    this.value = jsonAttribute || null;
                }

                SetVariableByJsonAttributeGeneralAction.prototype.toString = function () {
                    return 'Set variable "' + this.name + '" to the value of the JSON attribute "' + this.value + '"';
                };

                ActionService.register(actionGroupTypes.GENERAL, actionTypes[actionGroupTypes.GENERAL].SET_VARIABLE_BY_JSON_ATTRIBUTE, SetVariableByJsonAttributeGeneralAction);

                return SetVariableByJsonAttributeGeneralAction;
            }])
}());
