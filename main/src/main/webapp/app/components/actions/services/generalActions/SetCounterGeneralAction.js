(function () {
    'use strict';

    angular
        .module('ALEX.actions')
        .factory('SetCounterGeneralAction', ['ActionService', 'AbstractAction', 'actionGroupTypes', 'actionTypes',
            function (ActionService, AbstractAction, actionGroupTypes, actionTypes) {

                function SetCounterGeneralAction(name, value) {
                    AbstractAction.call(this, actionTypes[actionGroupTypes.GENERAL].SET_COUNTER);
                    this.name = name || null;
                    this.value = value || null;
                }

                SetCounterGeneralAction.prototype.toString = function () {
                    return 'Set counter "' + this.name + '" to "' + this.value + '"';
                };

                ActionService.register(actionGroupTypes.GENERAL, actionTypes[actionGroupTypes.GENERAL].SET_COUNTER, SetCounterGeneralAction);

                return SetCounterGeneralAction;
            }])
}());
