(function () {
    'use strict';

    angular
        .module('ALEX.actions')
        .factory('WaitGeneralAction', WaitGeneralActionFactory);

    WaitGeneralActionFactory.$inject = ['ActionService', 'AbstractAction', 'actionGroupTypes', 'actionTypes'];

    /**
     * The factory for WaitGeneralAction
     *
     * @param ActionService
     * @param AbstractAction
     * @param actionGroupTypes
     * @param actionTypes
     * @returns {WaitGeneralAction}
     * @constructor
     */
    function WaitGeneralActionFactory(ActionService, AbstractAction, actionGroupTypes, actionTypes) {

        /**
         * Wait for a certain amount of time before executing the next action+
         *
         * @param {number} duration - The time to wait in milliseconds
         * @constructor
         */
        function WaitGeneralAction(duration) {
            AbstractAction.call(this, actionTypes[actionGroupTypes.GENERAL].WAIT);
            this.duration = duration || 0;
        }

        WaitGeneralAction.prototype = Object.create(AbstractAction.prototype);

        /**
         * @returns {string}
         */
        WaitGeneralAction.prototype.toString = function () {
            return 'Wait for ' + this.duration + 'ms'
        };

        ActionService.register(
            actionGroupTypes.GENERAL,
            actionTypes[actionGroupTypes.GENERAL].WAIT,
            WaitGeneralAction
        );

        return WaitGeneralAction;
    }
}());
