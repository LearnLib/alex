(function () {
    'use strict';

    angular
        .module('ALEX.actions')
        .factory('ActionService', ActionService);

    /**
     * Contains functions to instantiate new actions according to their group and action type
     *
     * @returns {{register: register, get: get}}
     * @constructor
     */
    function ActionService() {

        // = [actionGroupType][actionType]
        var map = {};

        return {
            register: register,
            get: get
        };

        /**
         * Registers a new action so that it is available for others
         *
         * @param {number} actionGroupType
         * @param {string} actionType
         * @param {function} action
         */
        function register(actionGroupType, actionType, action) {
            if (map[actionGroupType] === undefined) {
                map[actionGroupType] = function () {
                };
            }
            map[actionGroupType][actionType] = action;
            return this;
        }

        /**
         * Gets the function to instantiate a specific action
         *
         * @param {number} actionGroupType
         * @param {string} actionType
         * @returns {function}
         */
        function get(actionGroupType, actionType) {
            return map[actionGroupType][actionType];
        }
    }
}());