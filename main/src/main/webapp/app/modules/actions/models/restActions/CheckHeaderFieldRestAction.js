(function () {
    'use strict';

    angular
        .module('ALEX.actions')
        .factory('CheckHeaderFieldRestAction', factory);

    /**
     * @param AbstractAction
     * @returns {CheckHeaderFieldRestAction}
     */
    function factory(AbstractAction) {

        /**
         * Checks a value in the header fields of an HTTP response
         *
         * @param {string} key - The key of the header field
         * @param {string} value - The expected value of the header field
         * @param {boolean} isRegexp - Whether the value is interpreted as regular epxression
         * @constructor
         */
        function CheckHeaderFieldRestAction(key, value, isRegexp) {
            AbstractAction.call(this, CheckHeaderFieldRestAction.type);
            this.key = key || null;
            this.value = value || null;
            this.regexp = isRegexp || false;
        }

        CheckHeaderFieldRestAction.prototype = Object.create(AbstractAction.prototype);

        /**
         * @returns {string}
         */
        CheckHeaderFieldRestAction.prototype.toString = function () {
            if (this.regexp) {
                return 'Check if HTTP header field "' + this.key + '" matches "' + this.value + '"';
            } else {
                return 'Check HTTP header field "' + this.key + '" to equal "' + this.value + '"';
            }
        };

        CheckHeaderFieldRestAction.type = 'rest_checkHeaderField';

        return CheckHeaderFieldRestAction;
    }

    factory.$inject = ['AbstractAction'];
}());
