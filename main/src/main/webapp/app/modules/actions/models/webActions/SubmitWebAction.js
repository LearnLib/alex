(function () {
    'use strict';

    angular
        .module('ALEX.actions')
        .factory('SubmitWebAction', SubmitWebActionFactory);

    SubmitWebActionFactory.$inject = ['AbstractAction', 'actionGroupTypes', 'actionTypes'];

    /**
     * The factory for SubmitWebAction
     *
     * @param AbstractAction
     * @param actionGroupTypes
     * @param actionTypes
     * @returns {SubmitWebAction}
     * @constructor
     */
    function SubmitWebActionFactory(AbstractAction, actionGroupTypes, actionTypes) {

        /**
         * Submits a form. Can also be applied to an input element of a form
         *
         * @param {string} node - The CSS selector of an element
         * @constructor
         */
        function SubmitWebAction(node) {
            AbstractAction.call(this, actionTypes[actionGroupTypes.WEB].SUBMIT);
            this.node = node || null;
        }

        SubmitWebAction.prototype = Object.create(AbstractAction.prototype);

        /**
         * @returns {string}
         */
        SubmitWebAction.prototype.toString = function () {
            return 'Submit element "' + this.node + '"';
        };

        return SubmitWebAction;
    }
}());
