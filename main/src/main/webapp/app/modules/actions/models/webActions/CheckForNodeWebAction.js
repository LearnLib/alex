(function () {
    'use strict';

    angular
        .module('ALEX.actions')
        .factory('CheckForNodeWebAction', factory);

    /**
     * @param AbstractAction
     * @returns {CheckForNodeWebAction}
     */
    function factory(AbstractAction) {

        /**
         * Searches for an element with a specific selector in the HTML document
         *
         * @param {string} selector - The CSS selector of an element
         * @constructor
         */
        function CheckForNodeWebAction(selector) {
            AbstractAction.call(this, CheckForNodeWebAction.type);
            this.value = selector || '';
        }

        CheckForNodeWebAction.prototype = Object.create(AbstractAction.prototype);

        /**
         * @returns {string}
         */
        CheckForNodeWebAction.prototype.toString = function () {
            return 'Search for element "' + this.value + '"';
        };

        CheckForNodeWebAction.type = 'web_checkForNode';

        return CheckForNodeWebAction;
    }

    factory.$inject = ['AbstractAction'];
}());
