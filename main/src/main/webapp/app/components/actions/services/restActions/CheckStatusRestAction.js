(function () {
    'use strict';

    angular
        .module('ALEX.actions')
        .factory('CheckStatusRestAction', ['ActionService', 'AbstractAction', 'actionGroupTypes', 'actionTypes',
            function (ActionService, AbstractAction, actionGroupTypes, actionTypes) {

                function CheckStatusRestAction(status) {
                    AbstractAction.call(this, actionTypes[actionGroupTypes.REST].CHECK_STATUS);
                    this.status = status || null;
                }

                CheckStatusRestAction.prototype.toString = function () {
                    return 'Check HTTP response status to be "' + this.status + '"'
                };

                ActionService.register(actionGroupTypes.REST, actionTypes[actionGroupTypes.REST].CHECK_STATUS, CheckStatusRestAction);

                return CheckStatusRestAction;
            }])
}());
