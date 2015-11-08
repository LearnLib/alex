(function () {
    'use strict';

    angular
        .module('ALEX.entities')
        .factory('SetVariableByCookieAction', factory);

    /**
     * @param AbstractAction
     * @returns {SetVariableByCookieAction}
     */
    // @ngInject
    function factory(AbstractAction) {

        /**
         * Sets a variable to a specific value and implicitly initializes it if it has not been created before
         *
         * @param {string} name - The name of the variable
         * @param {string} value - The value of the variable
         * @param {string} cookieType - The type of the cookie (REST|WEB)
         * @constructor
         */
        function SetVariableByCookieAction(name, value, cookieType) {
            AbstractAction.call(this, SetVariableByCookieAction.type);
            this.name = name || null;
            this.value = value || null;
            this.cookieType = cookieType || 'WEB';
        }

        SetVariableByCookieAction.prototype = Object.create(AbstractAction.prototype);

        /**
         * @returns {string}
         */
        SetVariableByCookieAction.prototype.toString = function () {
            return 'Set variable "' + this.name + '" to the value of the cookie: "' + this.value + '"';
        };

        SetVariableByCookieAction.type = 'setVariableByCookie';

        return SetVariableByCookieAction;
    }
}());
