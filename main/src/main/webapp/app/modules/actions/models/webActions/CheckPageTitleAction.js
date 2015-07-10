(function () {
    'use strict';

    angular
        .module('ALEX.actions')
        .factory('CheckPageTitleAction', CheckPageTitleActionFactory);

    CheckPageTitleActionFactory.$inject = ['AbstractAction', 'actionGroupTypes', 'actionTypes'];

    /**
     * The factory for CheckForTextWebAction
     *
     * @param AbstractAction
     * @param actionGroupTypes
     * @param actionTypes
     * @returns {CheckForTextWebAction}
     * @constructor
     */
    function CheckPageTitleActionFactory(AbstractAction, actionGroupTypes, actionTypes) {

        /**
         * Searches for a piece of text or a regular expression in the HTML document
         *
         * @param {string} title - The page title to look for
         * @param {boolean} regexp - If the title should be interpreted as regexp
         * @constructor
         */
        function CheckPageTitleAction(title, regexp) {
            AbstractAction.call(this, actionTypes[actionGroupTypes.WEB].CHECK_PAGE_TITLE);
            this.title = title || null;
            this.regexp = regexp || false;
        }

        CheckPageTitleAction.prototype = Object.create(AbstractAction.prototype);

        /**
         * @returns {string}
         */
        CheckPageTitleAction.prototype.toString = function () {
            return 'Check the page title to equal "' + this.title + '"';
        };

        return CheckPageTitleAction;
    }
}());
