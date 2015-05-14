(function () {
    'use strict';

    angular
        .module('ALEX.actions')
        .factory('IncrementCounterGeneralAction', IncrementCounterGeneralActionFactory);

    IncrementCounterGeneralActionFactory.$inject = ['ActionService', 'AbstractAction', 'actionGroupTypes', 'actionTypes'];

    /**
     * The factory for IncrementCounterGeneralAction
     *
     * @param ActionService
     * @param AbstractAction
     * @param actionGroupTypes
     * @param actionTypes
     * @returns {IncrementCounterGeneralAction}
     * @constructor
     */
    function IncrementCounterGeneralActionFactory(ActionService, AbstractAction, actionGroupTypes, actionTypes) {

        /**
         * Increments a counter by one
         *
         * @param {string} name - The name of the counter
         * @constructor
         */
        function IncrementCounterGeneralAction(name) {
            AbstractAction.call(this, actionTypes[actionGroupTypes.GENERAL].INCREMENT_COUNTER);
            this.name = name || null;
        }

        IncrementCounterGeneralAction.prototype = Object.create(AbstractAction.prototype);

        /**
         * @returns {string}
         */
        IncrementCounterGeneralAction.prototype.toString = function () {
            return 'Increment counter "' + this.name + '"';
        };

        ActionService.register(
            actionGroupTypes.GENERAL,
            actionTypes[actionGroupTypes.GENERAL].INCREMENT_COUNTER,
            IncrementCounterGeneralAction
        );

        return IncrementCounterGeneralAction;
    }
}());
