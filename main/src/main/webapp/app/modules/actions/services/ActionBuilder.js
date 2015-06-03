(function () {
    'use strict';

    angular
        .module('ALEX.actions')
        .factory('ActionBuilder', ActionBuilderFactory);

    ActionBuilderFactory.$inject = ['ActionService', 'actionGroupTypes', 'actionTypes'];

    /**
     * The factory for the action builder
     *
     * @param ActionService
     * @param actionGroupTypes
     * @param actionTypes
     * @returns {ActionBuilder}
     * @constructor
     */
    function ActionBuilderFactory(ActionService, actionGroupTypes, actionTypes) {

        /**
         * Is used to create instances of actions from objects or string types
         * @constructor
         */
        function ActionBuilder() {
        }

        /**
         * Creates a new action instance from a string type
         *
         * @param {string} type - The type of the action that should be created
         * @returns {null|*} - The action instance
         */
        ActionBuilder.prototype.createFromType = function (type) {
            if (type !== undefined) {
                for (var k in actionGroupTypes) {
                    for (var j in actionTypes[actionGroupTypes[k]]) {
                        if (type === actionTypes[actionGroupTypes[k]][j]) {
                            var Action = ActionService.get(actionGroupTypes[k], actionTypes[actionGroupTypes[k]][j]);
                            return new Action();
                        }
                    }
                }
                return null;
            } else {
                throw new Error('Undefined ActionType Error');
            }
        };

        /**
         * Creates a new action instance from a javascript object, e.g. from the API
         *
         * @param obj - The object the action is created from
         * @returns {null|*} - The action instance
         */
        ActionBuilder.prototype.createFromObject = function (obj) {
            var action;
            if (obj.type !== undefined) {
                action = this.createFromType(obj.type);
                for (var key in obj) {
                    if (key[0] !== '_') {
                        action.set(key, obj[key]);
                    }
                }
                return action;
            } else {
                throw new Error('Undefined ActionType Error');
            }
        };

        /**
         * Creates a bunch of action instances from javascript objects
         *
         * @param {Object[]} objects - The list of objects the actions should be created from
         * @returns {Array} - The list of actions
         */
        ActionBuilder.prototype.createFromObjects = function (objects) {
            var actions = [];
            for (var i = 0; i < objects.length; i++) {
                actions.push(this.createFromObject(objects[i]));
            }
            return actions;
        };

        return new ActionBuilder();
    }
}());