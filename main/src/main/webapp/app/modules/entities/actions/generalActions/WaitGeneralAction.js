(function () {
    'use strict';

    angular
        .module('ALEX.entities')
        .factory('WaitGeneralAction', factory);

    /**
     * @param AbstractAction
     * @returns {WaitGeneralAction}
     */
    // @ngInject
    function factory(AbstractAction) {

        /**
         * Wait for a certain amount of time before executing the next action+
         *
         * @param {number} duration - The time to wait in milliseconds
         * @constructor
         */
        function WaitGeneralAction(duration) {
            AbstractAction.call(this, WaitGeneralAction.type);
            this.duration = duration || 0;
        }

        WaitGeneralAction.prototype = Object.create(AbstractAction.prototype);

        /**
         * @returns {string}
         */
        WaitGeneralAction.prototype.toString = function () {
            return 'Wait for ' + this.duration + 'ms'
        };

        WaitGeneralAction.type = 'wait';

        return WaitGeneralAction;
    }
}());
