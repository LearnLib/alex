(function () {
    'use strict';

    angular
        .module('ALEX.actions')
        .factory('CheckForTextWebAction', ['ActionService', 'AbstractAction', 'actionGroupTypes', 'actionTypes',
            function (ActionService, AbstractAction, actionGroupTypes, actionTypes) {

                function CheckForTextWebAction(value, isRegexp) {
                    AbstractAction.call(this, actionTypes[actionGroupTypes.WEB].CHECK_FOR_TEXT);
                    this.value = value || null;
                    this.regexp = isRegexp || false;
                }

                CheckForTextWebAction.prototype.toString = function () {
                    return 'Search for ' + (this.regexp ? 'regexp' : '') + ' "' + this.value + '" in the document';
                };

                ActionService.register(actionGroupTypes.WEB, actionTypes[actionGroupTypes.WEB].CHECK_FOR_TEXT, CheckForTextWebAction);

                return CheckForTextWebAction;
            }])
}());
