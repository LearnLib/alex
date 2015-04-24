(function () {
    'use strict';

    angular
        .module('ALEX.actions')
        .factory('CheckHTTPBodyTextRestAction', ['ActionService', 'AbstractAction', 'actionGroupTypes', 'actionTypes',
            function (ActionService, AbstractAction, actionGroupTypes, actionTypes) {

                function CheckHTTPBodyTextRestAction(value, isRegexp) {
                    AbstractAction.call(this, actionTypes[actionGroupTypes.REST].CHECK_HTTP_BODY_TEXT);
                    this.value = value || null;
                    this.regexp = isRegexp || false;
                }

                CheckHTTPBodyTextRestAction.prototype.toString = function () {
                    return 'Search in the HTTP response body for ' + (this.regexp ? 'regexp' : 'string') + ' "' + this.value + '"';
                };

                ActionService.register(actionGroupTypes.REST, actionTypes[actionGroupTypes.REST].CHECK_HTTP_BODY_TEXT, CheckHTTPBodyTextRestAction);

                return CheckHTTPBodyTextRestAction;
            }])
}());
