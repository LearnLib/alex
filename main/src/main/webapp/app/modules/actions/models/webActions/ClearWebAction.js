(function () {
    'use strict';

    angular
        .module('ALEX.actions')
        .factory('ClearWebAction', factory);

    factory.$inject = ['AbstractAction'];

    /**
     * @param AbstractAction
     * @returns {ClearWebAction}
     */
    function factory(AbstractAction) {

        /**
         * Remove all inputs from an element
         *
         * @param {string} selector - The CSS selector of the element
         * @constructor
         */
        function ClearWebAction(selector) {
            AbstractAction.call(this, ClearWebAction.type);
            this.node = selector || '';
        }

        ClearWebAction.prototype = Object.create(AbstractAction.prototype);

        /**
         * @returns {string}
         */
        ClearWebAction.prototype.toString = function () {
            return 'Clear input "' + this.node + '"';
        };

        ClearWebAction.type = 'web_clear';

        return ClearWebAction;
    }
}());
