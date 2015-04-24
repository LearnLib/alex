(function () {
    'use strict';

    angular
        .module('ALEX.actions')
        .factory('CallRestAction', ['ActionService', 'AbstractAction', 'actionGroupTypes', 'actionTypes',
            function (ActionService, AbstractAction, actionGroupTypes, actionTypes) {

                function CallRestAction(method, url, data) {
                    AbstractAction.call(this, actionTypes[actionGroupTypes.REST].CALL_URL);
                    this.method = method || null;
                    this.url = url || null;
                    this.data = data || null;
                }

                CallRestAction.prototype.toString = function () {
                    return 'Make a "' + this.method + '" request to "' + this.url + '"';
                };

                ActionService.register(actionGroupTypes.REST, actionTypes[actionGroupTypes.REST].CALL_URL, CallRestAction);

                return CallRestAction;
            }])
}());
