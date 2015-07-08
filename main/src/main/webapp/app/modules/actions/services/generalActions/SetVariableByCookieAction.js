(function () {
    'use strict';

    angular
        .module('ALEX.actions')
        .factory('SetVariableByCookieAction', SetVariableByCookieAction);

    SetVariableByCookieAction.$inject = ['ActionService', 'AbstractAction', 'actionGroupTypes', 'actionTypes'];

    /**
     * The factory for SetVariableGeneralAction
     *
     * @param ActionService
     * @param AbstractAction
     * @param actionGroupTypes
     * @param actionTypes
     * @returns {SetVariableGeneralAction}
     * @constructor
     */
    function SetVariableByCookieAction(ActionService, AbstractAction, actionGroupTypes, actionTypes) {

        /**
         * Sets a variable to a specific value and implicitly initializes it if it has not been created before
         *
         * @param {string} name - The name of the variable
         * @param {string} value - The value of the variable
         * @param {string} cookieType - The type of the cookie (REST|WEB)
         * @constructor
         */
        function SetVariableByCookieAction(name, value, cookieType) {
            AbstractAction.call(this, actionTypes[actionGroupTypes.GENERAL].SET_VARIABLE_BY_COOKIE);
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

        ActionService.register(
            actionGroupTypes.GENERAL,
            actionTypes[actionGroupTypes.GENERAL].SET_VARIABLE_BY_COOKIE,
            SetVariableByCookieAction
        );

        return SetVariableByCookieAction;
    }
}());
