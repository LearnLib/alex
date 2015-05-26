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
            this.cookies = {};
            this.headers = {};
        }

        CallRestAction.prototype = Object.create(AbstractAction.prototype);

        /**
         * Adds a cookie to the action
         *
         * @param {string} key - The cookie key
         * @param {string} value - The cookie value
         */
        CallRestAction.prototype.addCookie = function (key, value) {
            this.cookies[key] = value;
        };

        /**
         * Removes a cookie from the action
         *
         * @param {string} key - The key of the cookie
         */
        CallRestAction.prototype.removeCookie = function (key) {
            if (angular.isDefined(this.cookies[key])) {
                delete this.cookies[key];
            }
        };

        /**
         * Adds a header field entry to the action
         *
         * @param {string} key - The Http header field name
         * @param {string} value - The Http header field value
         */
        CallRestAction.prototype.addHeader = function (key, value) {
            this.headers[key] = value;
        };

        /**
         * Removes a header field entry
         *
         * @param {string} key - The key of the Http header entry
         */
        CallRestAction.prototype.removeHeader = function (key) {
            if (angular.isDefined(this.headers[key])) {
                delete this.headers[key];
            }
        };

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
