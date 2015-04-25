(function () {
    'use strict';

    angular
        .module('ALEX.actions')
        .factory('SetCounterGeneralAction', SetCounterGeneralActionFactory);

    SetCounterGeneralActionFactory.$inject = ['ActionService', 'AbstractAction', 'actionGroupTypes', 'actionTypes'];

    /**
     * The factory for SetCounterGeneralAction
     *
     * @param ActionService
     * @param AbstractAction
     * @param actionGroupTypes
     * @param actionTypes
     * @returns {SetCounterGeneralAction}
     * @constructor
     */
    function SetCounterGeneralActionFactory(ActionService, AbstractAction, actionGroupTypes, actionTypes) {

        /**
         * Sets a counter to an integer value and creates it implicitly if the counter has not been initialized or used
         * before
         *
         * @param {string} name - The name of the counter
         * @param {number} value - The value of the counter
         * @constructor
         */
        function SetCounterGeneralAction(name, value) {
            AbstractAction.call(this, actionTypes[actionGroupTypes.GENERAL].SET_COUNTER);
            this.name = name || null;
            this.value = value || null;
        }

        SetCounterGeneralAction.prototype = Object.create(AbstractAction.prototype);

        /**
         * @returns {string}
         */
        SetCounterGeneralAction.prototype.toString = function () {
            return 'Set counter "' + this.name + '" to "' + this.value + '"';
        };

        ActionService.register(
            actionGroupTypes.GENERAL,
            actionTypes[actionGroupTypes.GENERAL].SET_COUNTER,
            SetCounterGeneralAction
        );

        return SetCounterGeneralAction;
    }
}());
