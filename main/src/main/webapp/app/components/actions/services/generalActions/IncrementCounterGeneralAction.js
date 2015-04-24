(function () {
    'use strict';

    angular
        .module('ALEX.actions')
        .factory('IncrementCounterGeneralAction', ['ActionService', 'AbstractAction', 'actionGroupTypes', 'actionTypes',
            function (ActionService, AbstractAction, actionGroupTypes, actionTypes) {

                function IncrementCounterGeneralAction(name) {
                    AbstractAction.call(this, actionTypes[actionGroupTypes.GENERAL].INCREMENT_COUNTER);
                    this.name = name || null;
                }

                IncrementCounterGeneralAction.prototype.toString = function () {
                    return 'Increment counter "' + this.name + '"';
                };

                ActionService.register(actionGroupTypes.GENERAL, actionTypes[actionGroupTypes.GENERAL].INCREMENT_COUNTER, IncrementCounterGeneralAction);

                return IncrementCounterGeneralAction;
            }])
}());
