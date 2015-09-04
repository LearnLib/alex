(function () {
    'use strict';

    angular
        .module('ALEX.actions')
        .factory('AssertVariableAction', AssertVariableActionFactory);

    AssertVariableActionFactory.$inject = ['AbstractAction', 'actionGroupTypes', 'actionTypes'];

    function AssertVariableActionFactory(AbstractAction, actionGroupTypes, actionTypes) {

        /**
         * Action to check if the value of a variable equals or matches a specific string value
         *
         * @param {string} name - The name of the variable
         * @param {string} value - The value to assert against
         * @param {boolean} regexp - If value is a regular expression
         * @constructor
         */
        function AssertVariableAction(name, value, regexp) {
            AbstractAction.call(this, actionTypes[actionGroupTypes.GENERAL].ASSERT_VARIABLE);
            this.name = name || null;
            this.value = value || null;
            this.regexp = regexp || false;
        }

        AssertVariableAction.prototype = Object.create(AbstractAction.prototype);

        AssertVariableAction.prototype.toString = function () {
            if (this.regexp) {
                return 'Assert variable "' + this.name + '" to match "' + this.value + '"';
            } else {
                return 'Assert variable "' + this.name + '" to equal "' + this.value + '"';
            }
        };

        return AssertVariableAction;
    }
}());