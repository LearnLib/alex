(function () {
    'use strict';

    angular
        .module('ALEX.entities')
        .factory('SetVariableByNodeGeneralAction', factory);

    /**
     * @param AbstractAction
     * @returns {SetVariableByNodeGeneralAction}
     */
    // @ngInject
    function factory(AbstractAction) {

        /**
         * Extracts the text content value of an element and saves it value in a variable
         *
         * @param {string} name - The name of the variable
         * @param {string} selector - The CSS selector of an element
         * @constructor
         */
        function SetVariableByNodeGeneralAction(name, selector) {
            AbstractAction.call(this, SetVariableByNodeGeneralAction.type);
            this.name = name || null;
            this.value = selector || null;
        }

        SetVariableByNodeGeneralAction.prototype = Object.create(AbstractAction.prototype);

        /**
         * @returns {string}
         */
        SetVariableByNodeGeneralAction.prototype.toString = function () {
            return 'Set variable "' + this.name + '" to the value of the element "' + this.value + '"';
        };

        SetVariableByNodeGeneralAction.type = 'setVariableByHTML';

        return SetVariableByNodeGeneralAction;
    }
}());
