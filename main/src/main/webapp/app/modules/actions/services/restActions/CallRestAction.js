(function () {
    'use strict';

    angular
        .module('ALEX.actions')
        .factory('CallRestAction', CallRestActionFactory);

    CallRestActionFactory.$inject = ['ActionService', 'AbstractAction', 'actionGroupTypes', 'actionTypes'];

    /**
     * The factory for CallRestAction
     *
     * @param ActionService
     * @param AbstractAction
     * @param actionGroupTypes
     * @param actionTypes
     * @returns {CallRestAction}
     * @constructor
     */
    function CallRestActionFactory(ActionService, AbstractAction, actionGroupTypes, actionTypes) {

        /**
         * Makes an HTTP request
         *
         * @param {string} method - The HTTP method in {GET,POST,PUT,DELETE}
         * @param {string} url - The URL the request is send to
         * @param {string} data - The body data for POST and PUT requests
         * @constructor
         */
        function CallRestAction(method, url, data) {
            AbstractAction.call(this, actionTypes[actionGroupTypes.REST].CALL_URL);
            this.method = method || null;
            this.url = url || null;
            this.data = data || null;
        }

        CallRestAction.prototype = Object.create(AbstractAction.prototype);

        /**
         * @returns {string}
         */
        CallRestAction.prototype.toString = function () {
            return 'Make a "' + this.method + '" request to "' + this.url + '"';
        };

        ActionService.register(actionGroupTypes.REST, actionTypes[actionGroupTypes.REST].CALL_URL, CallRestAction);

        return CallRestAction;
    }
}());
