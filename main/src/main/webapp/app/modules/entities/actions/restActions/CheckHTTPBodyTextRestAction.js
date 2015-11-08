(function () {
    'use strict';

    angular
        .module('ALEX.entities')
        .factory('CheckHTTPBodyTextRestAction', factory);

    /**
     * @param AbstractAction
     * @returns {CheckHTTPBodyTextRestAction}
     */
    // @ngInject
    function factory(AbstractAction) {

        /**
         * Searches for a string value in the body of an HTTP response
         *
         * @param {string} value - The string that is searched for
         * @param {boolean} isRegexp - Whether the value is interpreted as regular expression
         * @constructor
         */
        function CheckHTTPBodyTextRestAction(value, isRegexp) {
            AbstractAction.call(this, CheckHTTPBodyTextRestAction.type);
            this.value = value || null;
            this.regexp = isRegexp || false;
        }

        CheckHTTPBodyTextRestAction.prototype = Object.create(AbstractAction.prototype);

        /**
         * @returns {string}
         */
        CheckHTTPBodyTextRestAction.prototype.toString = function () {
            if (this.regexp) {
                return 'Search in the response with regexp "' + this.value + '"';
            } else {
                return 'Search in the response body for "' + this.value + '"';
            }
        };

        CheckHTTPBodyTextRestAction.type = 'rest_checkForText';

        return CheckHTTPBodyTextRestAction;
    }
}());
