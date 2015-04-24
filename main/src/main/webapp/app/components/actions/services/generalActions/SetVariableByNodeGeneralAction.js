(function () {
    'use strict';

    angular
        .module('ALEX.actions')
        .factory('SetVariableByNodeGeneralAction', ['ActionService', 'AbstractAction', 'actionGroupTypes', 'actionTypes',
            function (ActionService, AbstractAction, actionGroupTypes, actionTypes) {

                function SetVariableByNodeGeneralAction(name, selector) {
                    AbstractAction.call(this, actionTypes[actionGroupTypes.GENERAL].SET_VARIABLE_BY_NODE);
                    this.name = name || null;
                    this.value = selector || null;
                }

                SetVariableByNodeGeneralAction.prototype.toString = function () {
                    return 'Set variable "' + this.name + '" to the value of the element "' + this.value + '"';
                };

                ActionService.register(actionGroupTypes.GENERAL, actionTypes[actionGroupTypes.GENERAL].SET_VARIABLE_BY_NODE, SetVariableByNodeGeneralAction);

                return SetVariableByNodeGeneralAction;
            }])
}());
