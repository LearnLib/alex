(function () {
    'use strict';

    angular
        .module('ALEX.actions')
        .factory('CheckForTextWebAction', CheckForTextWebActionFactory);

    CheckForTextWebActionFactory.$inject = ['AbstractAction', 'actionGroupTypes', 'actionTypes'];

    /**
     * The factory for CheckForTextWebAction
     *
     * @param AbstractAction
     * @param actionGroupTypes
     * @param actionTypes
     * @returns {CheckForTextWebAction}
     * @constructor
     */
    function CheckForTextWebActionFactory(AbstractAction, actionGroupTypes, actionTypes) {

        /**
         * Searches for a piece of text or a regular expression in the HTML document
         *
         * @param {string} value - The piece of text to look for
         * @param {boolean} isRegexp - Whether the value is a regular expression
         * @constructor
         */
        function CheckForTextWebAction(value, isRegexp) {
            AbstractAction.call(this, actionTypes[actionGroupTypes.WEB].CHECK_FOR_TEXT);
            this.value = value || null;
            this.regexp = isRegexp || false;
        }

        CheckForTextWebAction.prototype = Object.create(AbstractAction.prototype);

        /**
         * @returns {string}
         */
        CheckForTextWebAction.prototype.toString = function () {
            return 'Search for ' + (this.regexp ? 'regexp' : '') + ' "' + this.value + '" in the document';
        };

        return CheckForTextWebAction;
    }
}());
