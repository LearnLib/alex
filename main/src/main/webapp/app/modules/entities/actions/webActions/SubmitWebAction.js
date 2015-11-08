(function () {
    'use strict';

    angular
        .module('ALEX.entities')
        .factory('SubmitWebAction', factory);

    /**
     * @param AbstractAction
     * @returns {SubmitWebAction}
     */
    // @ngInject
    function factory(AbstractAction) {

        /**
         * Submits a form. Can also be applied to an input element of a form
         *
         * @param {string} selector - The CSS selector of an element
         * @constructor
         */
        function SubmitWebAction(selector) {
            AbstractAction.call(this, SubmitWebAction.type);
            this.node = selector || '';
        }

        SubmitWebAction.prototype = Object.create(AbstractAction.prototype);

        /**
         * @returns {string}
         */
        SubmitWebAction.prototype.toString = function () {
            return 'Submit form "' + this.node + '"';
        };

        SubmitWebAction.type = 'web_submit';

        return SubmitWebAction;
    }
}());
