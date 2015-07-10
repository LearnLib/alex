(function () {
    'use strict';

    angular
        .module('ALEX.actions')
        .factory('CheckStatusRestAction', CheckStatusRestActionFactory);

    CheckStatusRestActionFactory.$inject = ['AbstractAction', 'actionGroupTypes', 'actionTypes'];

    /**
     * The factory for CheckStatusRestAction
     *
     * @param AbstractAction
     * @param actionGroupTypes
     * @param actionTypes
     * @returns {CheckStatusRestAction}
     * @constructor
     */
    function CheckStatusRestActionFactory(AbstractAction, actionGroupTypes, actionTypes) {

        /**
         * Checks for the status code (e.g. 404) in an HTTP response
         *
         * @param {number} status - The status code
         * @constructor
         */
        function CheckStatusRestAction(status) {
            AbstractAction.call(this, actionTypes[actionGroupTypes.REST].CHECK_STATUS);
            this.status = status || null;
        }

        CheckStatusRestAction.prototype = Object.create(AbstractAction.prototype);

        /**
         * @returns {string}
         */
        CheckStatusRestAction.prototype.toString = function () {
            return 'Check HTTP response status to be "' + this.status + '"'
        };

        return CheckStatusRestAction;
    }
}());
