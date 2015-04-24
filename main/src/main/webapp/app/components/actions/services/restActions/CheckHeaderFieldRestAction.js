(function () {
    'use strict';

    angular
        .module('ALEX.actions')
        .factory('CheckHeaderFieldRestAction', ['ActionService', 'AbstractAction', 'actionGroupTypes', 'actionTypes',
            function (ActionService, AbstractAction, actionGroupTypes, actionTypes) {

                function CheckHeaderFieldRestAction(key, value, isRegexp) {
                    AbstractAction.call(this, actionTypes[actionGroupTypes.REST].CHECK_HEADER_FIELD);
                    this.key = key || null;
                    this.value = value || null;
                    this.regexp = isRegexp || false;
                }

                CheckHeaderFieldRestAction.prototype.toString = function () {
                    return 'Check HTTP response header field "' + this.key + '" to be' + (this.regexp ? ' like ' : ' ') + '"' + this.value + '"';
                };

                ActionService.register(actionGroupTypes.REST, actionTypes[actionGroupTypes.REST].CHECK_HEADER_FIELD, CheckHeaderFieldRestAction);

                return CheckHeaderFieldRestAction;
            }])
}());
