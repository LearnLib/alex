(function () {
    'use strict';

    angular
        .module('ALEX.actions')
        .factory('AssertCounterAction', AssertCounterActionFactory);

    AssertCounterActionFactory.$inject = ['AbstractAction', 'actionGroupTypes', 'actionTypes'];

    function AssertCounterActionFactory(AbstractAction, actionGroupTypes, actionTypes) {

        /**
         * Action to compare the value of a counter to another integer value
         *
         * @param {string} name - The name of the counter
         * @param {string} value - The value to compare the content with
         * @param {string} operator - The operator to compare two integer values
         * @constructor
         */
        function AssertCounterAction(name, value, operator) {
            AbstractAction.call(this, actionTypes[actionGroupTypes.GENERAL].ASSERT_COUNTER);
            this.name = name || null;
            this.value = value || null;
            this.operator = operator || null;
        }

        AssertCounterAction.prototype = Object.create(AbstractAction.prototype);

        AssertCounterAction.prototype.toString = function () {
            var s;

            switch (this.operator) {
                case 'LESS_THAN':
                    s = 'less than';
                    break;
                case 'LESS_OR_EQUAL':
                    s = 'less or equal to';
                    break;
                case 'EQUAL':
                    s = 'equal to';
                    break;
                case 'GREATER_OR_EQUAL':
                    s = 'greater or equal to';
                    break;
                case 'GREATER_THAN':
                    s = 'greater than';
                    break;
                default:
                    s = 'undefined';
                    break;
            }

            return 'Check if counter "' + this.name + '" is ' + s + ' ' + this.value;
        };

        return AssertCounterAction;
    }
}());