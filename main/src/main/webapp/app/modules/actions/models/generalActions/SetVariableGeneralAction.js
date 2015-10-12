(function () {
    'use strict';

    angular
        .module('ALEX.actions')
        .factory('SetVariableGeneralAction', factory);

    /**
     * @param AbstractAction
     * @returns {SetVariableGeneralAction}
     */
    function factory(AbstractAction) {

        /**
         * Sets a variable to a specific value and implicitly initializes it if it has not been created before
         *
         * @param {string} name - The name of the variable
         * @param {string} value - The value of the variable
         * @constructor
         */
        function SetVariableGeneralAction(name, value) {
            AbstractAction.call(this, SetVariableGeneralAction.type);
            this.name = name || null;
            this.value = value || null;
        }

        SetVariableGeneralAction.prototype = Object.create(AbstractAction.prototype);

        /**
         * @returns {string}
         */
        SetVariableGeneralAction.prototype.toString = function () {
            return 'Set variable "' + this.name + '" to "' + this.value + '"';
        };

        SetVariableGeneralAction.type = 'setVariable';

        return SetVariableGeneralAction;
    }

    factory.$inject = ['AbstractAction'];
}());
