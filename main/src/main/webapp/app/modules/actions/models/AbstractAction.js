(function () {
    'use strict';

    angular
        .module('ALEX.actions')
        .factory('AbstractAction', factory);

    /**
     * @returns {AbstractAction}
     */
    function factory() {

        /**
         * The action model all other actions should extend from
         *
         * @param {string} type - The unique action type
         * @param {boolean} negated - Whether the outcome is negated
         * @param {boolean} ignoreFailure - Whether the learner continues despite failure
         * @param {boolean} disabled - Whether the execution of the action should be skipped
         * @constructor
         */
        function AbstractAction(type, negated, ignoreFailure, disabled) {
            this.type = type;
            this.negated = negated || false;
            this.ignoreFailure = ignoreFailure || false;
            this.disabled = disabled || false;
        }

        AbstractAction.prototype.set = function (key, value) {
            this[key] = value;
        };

        AbstractAction.prototype.toString = function () {
            return 'There is no string representation available for type "' + this.type + '"';
        };

        return AbstractAction;
    }
}());