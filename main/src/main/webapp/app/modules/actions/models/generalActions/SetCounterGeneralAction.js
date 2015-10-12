(function () {
    'use strict';

    angular
        .module('ALEX.actions')
        .factory('SetCounterGeneralAction', factory);

    /**
     * @param AbstractAction
     * @returns {SetCounterGeneralAction}
     */
    function factory(AbstractAction) {

        /**
         * Sets a counter to an integer value and creates it implicitly if the counter has not been initialized or used
         * before
         *
         * @param {string} name - The name of the counter
         * @param {number} value - The value of the counter
         * @constructor
         */
        function SetCounterGeneralAction(name, value) {
            AbstractAction.call(this, SetCounterGeneralAction.type);
            this.name = name || null;
            this.value = value || null;
        }

        SetCounterGeneralAction.prototype = Object.create(AbstractAction.prototype);

        /**
         * @returns {string}
         */
        SetCounterGeneralAction.prototype.toString = function () {
            return 'Set counter "' + this.name + '" to "' + this.value + '"';
        };

        SetCounterGeneralAction.type = 'setCounter';

        return SetCounterGeneralAction;
    }

    factory.$inject = ['AbstractAction'];
}());
