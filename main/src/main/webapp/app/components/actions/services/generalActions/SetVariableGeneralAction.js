(function () {
    'use strict';

    angular
        .module('ALEX.actions')
        .factory('SetVariableGeneralAction', ['ActionService', 'AbstractAction', 'actionGroupTypes', 'actionTypes',
            function (ActionService, AbstractAction, actionGroupTypes, actionTypes) {

                function SetVariableGeneralAction(name, value) {
                    AbstractAction.call(this, actionTypes[actionGroupTypes.GENERAL].SET_VARIABLE);
                    this.name = name || null;
                    this.value = value || null;
                }

                SetVariableGeneralAction.prototype.toString = function () {
                    return 'Set variable "' + this.name + '" to "' + this.value + '"';
                };

                ActionService.register(actionGroupTypes.GENERAL, actionTypes[actionGroupTypes.GENERAL].SET_VARIABLE, SetVariableGeneralAction);

                return SetVariableGeneralAction;
            }])
}());
