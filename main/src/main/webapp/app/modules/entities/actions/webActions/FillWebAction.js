(function () {
    'use strict';

    angular
        .module('ALEX.entities')
        .factory('FillWebAction', factory);

    /**
     * @param AbstractAction
     * @returns {FillWebAction}
     */
    // @ngInject
    function factory(AbstractAction) {

        /**
         * Fills an input element with a value
         *
         * @param {selector} selector - The CSS selector of an element
         * @param {string} value - The value it should be filled with
         * @constructor
         */
        function FillWebAction(selector, value) {
            AbstractAction.call(this, FillWebAction.type);
            this.node = selector || '';
            this.value = value || '';
        }

        FillWebAction.prototype = Object.create(AbstractAction.prototype);

        /**
         * @returns {string}
         */
        FillWebAction.prototype.toString = function () {
            return 'Fill input "' + this.node + '" with "' + this.value + '"';
        };

        FillWebAction.type = 'web_fill';

        return FillWebAction;
    }
}());
