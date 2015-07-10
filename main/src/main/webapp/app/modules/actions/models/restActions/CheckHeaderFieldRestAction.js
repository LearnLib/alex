(function () {
    'use strict';

    angular
        .module('ALEX.actions')
        .factory('CheckHeaderFieldRestAction', CheckHeaderFieldRestActionFactory);

    CheckHeaderFieldRestActionFactory.$inject = ['AbstractAction', 'actionGroupTypes', 'actionTypes'];

    /**
     * The factory for CheckHeaderFieldRestAction
     *
     * @param AbstractAction
     * @param actionGroupTypes
     * @param actionTypes
     * @returns {CheckHeaderFieldRestAction}
     * @constructor
     */
    function CheckHeaderFieldRestActionFactory(AbstractAction, actionGroupTypes, actionTypes) {

        /**
         * Checks a value in the header fields of an HTTP response
         *
         * @param {string} key - The key of the header field
         * @param {string} value - The expected value of the header field
         * @param {boolean} isRegexp - Whether the value is interpreted as regular epxression
         * @constructor
         */
        function CheckHeaderFieldRestAction(key, value, isRegexp) {
            AbstractAction.call(this, actionTypes[actionGroupTypes.REST].CHECK_HEADER_FIELD);
            this.key = key || null;
            this.value = value || null;
            this.regexp = isRegexp || false;
        }

        CheckHeaderFieldRestAction.prototype = Object.create(AbstractAction.prototype);

        /**
         * @returns {string}
         */
        CheckHeaderFieldRestAction.prototype.toString = function () {
            return 'Check HTTP response header field "' + this.key + '" to be' + (this.regexp ? ' like ' : ' ') + '"' + this.value + '"';
        };

        return CheckHeaderFieldRestAction;
    }
}());
