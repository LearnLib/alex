(function () {
    'use strict';

    angular
        .module('ALEX.actions')
        .factory('ActionBuilder', ['ActionService', 'actionGroupTypes', 'actionTypes',
            function (ActionService, actionGroupTypes, actionTypes) {

                function ActionBuilder() {
                }

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

                ActionBuilder.prototype.createFromObject = function (obj) {
                    var action;

                    if (obj.type !== undefined) {
                        action = this.createFromType(obj.type);
                        for (var key in obj) {
                            if (action.hasOwnProperty(key)) {
                                action[key] = obj[key]
                            }
                        }
                        return action;
                    } else {
                        throw new Error('Undefined ActionType Error');
                    }
                };

                ActionBuilder.prototype.createFromObjects = function (objs) {
                    var actions = [];
                    for (var i = 0; i < objs.length; i++) {
                        actions.push(this.createFromObject(objs[i]));
                    }
                    return actions;
                };

                return new ActionBuilder();
            }])
}());