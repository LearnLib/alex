(function () {
    'use strict';

    angular
        .module('ALEX.actions')
        .factory('CheckForNodeWebAction', ['ActionService', 'AbstractAction', 'actionGroupTypes', 'actionTypes',
            function (ActionService, AbstractAction, actionGroupTypes, actionTypes) {

                function CheckForNodeWebAction(value) {
                    AbstractAction.call(this, actionTypes[actionGroupTypes.WEB].CHECK_FOR_NODE);
                    this.value = value || null;
                }

                CheckForNodeWebAction.prototype.toString = function () {
                    return 'Search for node "' + this.value + '"';
                };

                ActionService.register(actionGroupTypes.WEB, actionTypes[actionGroupTypes.WEB].CHECK_FOR_NODE, CheckForNodeWebAction);

                return CheckForNodeWebAction;
            }])
}());
