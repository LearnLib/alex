(function () {
    'use strict';

    angular
        .module('ALEX.entities')
        .factory('ClickWebAction', factory);

    /**
     * @param AbstractAction
     * @returns {ClickWebAction}
     */
    // @ngInject
    function factory(AbstractAction) {

        /**
         * Clicks on an element
         *
         * @param {string} node - The CSS selector of an element
         * @constructor
         */
        function ClickWebAction(node) {
            AbstractAction.call(this, ClickWebAction.type);
            this.node = node || '';
        }

        ClickWebAction.prototype = Object.create(AbstractAction.prototype);

        /**
         * @returns {string}
         */
        ClickWebAction.prototype.toString = function () {
            return 'Click on element "' + this.node + '"';
        };

        ClickWebAction.type = 'web_click';

        return ClickWebAction;
    }
}());
