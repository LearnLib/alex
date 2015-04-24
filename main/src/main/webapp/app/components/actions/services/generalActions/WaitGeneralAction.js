(function () {
    'use strict';

    angular
        .module('ALEX.actions')
        .factory('WaitGeneralAction', ['ActionService', 'AbstractAction', 'actionGroupTypes', 'actionTypes',
            function (ActionService, AbstractAction, actionGroupTypes, actionTypes) {

                function WaitGeneralAction(duration) {
                    AbstractAction.call(this, actionTypes[actionGroupTypes.GENERAL].WAIT);
                    this.duration = duration || 0;
                }

                WaitGeneralAction.prototype.toString = function () {
                    return 'Wait for ' + this.duration + 'ms'
                };

                ActionService.register(actionGroupTypes.GENERAL, actionTypes[actionGroupTypes.GENERAL].WAIT, WaitGeneralAction);

                return WaitGeneralAction;
            }])
}());
