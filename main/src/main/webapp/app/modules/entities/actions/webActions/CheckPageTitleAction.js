(function () {
    'use strict';

    angular
        .module('ALEX.entities')
        .factory('CheckPageTitleAction', factory);

    /**
     * @param AbstractAction
     * @returns {CheckPageTitleAction}
     */
    // @ngInject
    function factory(AbstractAction) {

        /**
         * Searches for a piece of text or a regular expression in the HTML document.
         * Type should be 'web_checkPageTitle'
         *
         * @param {string} title - The page title to look for or the regexp to match the title against
         * @param {boolean} isRegexp - If the title should be interpreted as regexp
         * @constructor
         */
        function CheckPageTitleAction(title, isRegexp) {
            AbstractAction.call(this, CheckPageTitleAction.type);
            this.title = title || '';
            this.regexp = isRegexp || false;
        }

        // inherit functions from AbstractAction
        CheckPageTitleAction.prototype = Object.create(AbstractAction.prototype);

        /**
         * @returns {string} - The string representation of the action
         */
        CheckPageTitleAction.prototype.toString = function () {
            if (this.regexp) {
                return 'Check if the page title matches "' + this.title + '"';
            } else {
                return 'Check if the page title equals "' + this.title + '"';
            }
        };

        CheckPageTitleAction.type = 'web_checkPageTitle';

        return CheckPageTitleAction;
    }
}());
