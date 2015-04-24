(function () {
    'use strict';

    angular
        .module('ALEX.actions')
        .factory('ActionService', function () {
            var Action = {};

            return {
                register: register,
                get: get
            };

            function register(actionGroupType, actionType, action) {
                if (Action[actionGroupType] === undefined) {
                    Action[actionGroupType] = function () {
                    };
                }
                Action[actionGroupType][actionType] = action;
            }

            function get(actionGroupType, actionType) {
                return Action[actionGroupType][actionType];
            }
        })
}());