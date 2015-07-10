(function () {
    'use strict';

    angular
        .module('ALEX.actions')
        .factory('CheckHTTPBodyTextRestAction', CheckHTTPBodyTextRestActionFactory);

    CheckHTTPBodyTextRestActionFactory.$inject = ['AbstractAction', 'actionGroupTypes', 'actionTypes'];

    /**
     * The factory for CheckHTTPBodyTextRestAction
     *
     * @param AbstractAction
     * @param actionGroupTypes
     * @param actionTypes
     * @returns {CheckHTTPBodyTextRestAction}
     * @constructor
     */
    function CheckHTTPBodyTextRestActionFactory(AbstractAction, actionGroupTypes, actionTypes) {

        /**
         * Searches for a string value in the body of an HTTP response
         *
         * @param {string} value - The string that is searched for
         * @param {boolean} isRegexp - Whether the value is interpreted as regular expression
         * @constructor
         */
        function CheckHTTPBodyTextRestAction(value, isRegexp) {
            AbstractAction.call(this, actionTypes[actionGroupTypes.REST].CHECK_HTTP_BODY_TEXT);
            this.value = value || null;
            this.regexp = isRegexp || false;
        }

        CheckHTTPBodyTextRestAction.prototype = Object.create(AbstractAction.prototype);

        /**
         * @returns {string}
         */
        CheckHTTPBodyTextRestAction.prototype.toString = function () {
            return 'Search in the HTTP response body for ' + (this.regexp ? 'regexp' : 'string') + ' "' + this.value + '"';
        };

        return CheckHTTPBodyTextRestAction;
    }
}());
