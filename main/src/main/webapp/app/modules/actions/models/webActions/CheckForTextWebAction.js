(function () {
    'use strict';

    angular
        .module('ALEX.actions')
        .factory('CheckForTextWebAction', factory);

    /**
     * @param AbstractAction
     * @returns {CheckForTextWebAction}
     */
    function factory(AbstractAction) {

        /**
         * Searches for a piece of text or a regular expression in the HTML document
         *
         * @param {string} value - The piece of text to look for
         * @param {boolean} isRegexp - Whether the value is a regular expression
         * @constructor
         */
        function CheckForTextWebAction(value, isRegexp) {
            AbstractAction.call(this, CheckForTextWebAction.type);
            this.value = value || '';
            this.regexp = isRegexp || false;
        }

        CheckForTextWebAction.prototype = Object.create(AbstractAction.prototype);

        /**
         * @returns {string}
         */
        CheckForTextWebAction.prototype.toString = function () {
            if (this.regexp) {
                return 'Check if the document matches "' + this.value + '"';
            } else {
                return 'Search for "' + this.value + '" in the document';
            }
        };

        CheckForTextWebAction.type = 'web_checkForText';

        return CheckForTextWebAction;
    }

    factory.$inject = ['AbstractAction'];
}());
