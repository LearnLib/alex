(function () {
    'use strict';

    angular
        .module('ALEX.entities')
        .factory('IncrementCounterGeneralAction', factory);

    /**
     * @param AbstractAction
     * @returns {IncrementCounterGeneralAction}
     */
    // @ngInject
    function factory(AbstractAction) {

        /**
         * Increments a counter by one
         *
         * @param {string} name - The name of the counter
         * @constructor
         */
        function IncrementCounterGeneralAction(name) {
            AbstractAction.call(this, IncrementCounterGeneralAction.type);
            this.name = name || null;
        }

        IncrementCounterGeneralAction.prototype = Object.create(AbstractAction.prototype);

        /**
         * @returns {string}
         */
        IncrementCounterGeneralAction.prototype.toString = function () {
            return 'Increment counter "' + this.name + '"';
        };

        IncrementCounterGeneralAction.type = 'incrementCounter';

        return IncrementCounterGeneralAction;
    }
}());
