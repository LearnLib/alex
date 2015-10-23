(function () {
    'use strict';

    angular
        .module('ALEX.actions')
        .factory('ClickLinkByTextWebAction', factory);

    /**
     * @param AbstractAction
     * @returns {ClickLinkByTextWebAction}
     */
    function factory(AbstractAction) {

        /**
         * Clicks on a link with a specific text value
         *
         * @param {string} value - The text of the link
         * @constructor
         */
        function ClickLinkByTextWebAction(value) {
            AbstractAction.call(this, ClickLinkByTextWebAction.type);
            this.value = value || null;
        }

        ClickLinkByTextWebAction.prototype = Object.create(AbstractAction.prototype);

        /**
         * @returns {string}
         */
        ClickLinkByTextWebAction.prototype.toString = function () {
            return 'Click on link with text "' + this.value + '"';
        };

        ClickLinkByTextWebAction.type = 'web_clickLinkByText';

        return ClickLinkByTextWebAction;
    }

    factory.$inject = ['AbstractAction'];
}());
