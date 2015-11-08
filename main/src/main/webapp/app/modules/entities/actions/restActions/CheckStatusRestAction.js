(function () {
    'use strict';

    angular
        .module('ALEX.entities')
        .factory('CheckStatusRestAction', factory);

    /**
     * @param AbstractAction
     * @returns {CheckStatusRestAction}
     */
    // @ngInject
    function factory(AbstractAction) {

        /**
         * Checks for the status code (e.g. 404) in an HTTP response
         *
         * @param {number} status - The status code
         * @constructor
         */
        function CheckStatusRestAction(status) {
            AbstractAction.call(this, CheckStatusRestAction.type);
            this.status = status || null;
        }

        CheckStatusRestAction.prototype = Object.create(AbstractAction.prototype);

        /**
         * @returns {string}
         */
        CheckStatusRestAction.prototype.toString = function () {
            return 'Check HTTP response status to be "' + this.status + '"';
        };

        CheckStatusRestAction.type = 'rest_checkStatus';

        return CheckStatusRestAction;
    }
}());
