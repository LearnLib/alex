(function () {
    'use strict';

    angular
        .module('ALEX.actions')
        .factory('ClearWebAction', ['ActionService', 'AbstractAction', 'actionGroupTypes', 'actionTypes',
            function (ActionService, AbstractAction, actionGroupTypes, actionTypes) {

                function ClearWebAction(node) {
                    AbstractAction.call(this, actionTypes[actionGroupTypes.WEB].CLEAR);
                    this.node = node || null;
                }

                ClearWebAction.prototype.toString = function () {
                    return 'Clear element "' + this.node + '"';
                };

                ActionService.register(actionGroupTypes.WEB, actionTypes[actionGroupTypes.WEB].CLEAR, ClearWebAction);

                return ClearWebAction;
            }])
}());
