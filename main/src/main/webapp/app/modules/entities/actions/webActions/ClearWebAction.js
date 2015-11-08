(function () {
    'use strict';

    angular
        .module('ALEX.entities')
        .factory('ClearWebAction', factory);

    /**
     * @param AbstractAction
     * @returns {ClearWebAction}
     */
    // @ngInject
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
