(function () {
    'use strict';

    angular
        .module('ALEX.actions')
        .factory('ClickWebAction', ['ActionService', 'AbstractAction', 'actionGroupTypes', 'actionTypes',
            function (ActionService, AbstractAction, actionGroupTypes, actionTypes) {

                function ClickWebAction(node) {
                    AbstractAction.call(this, actionTypes[actionGroupTypes.WEB].CLICK);
                    this.node = node || null;
                }

                ClickWebAction.prototype.toString = function () {
                    return 'Click on element "' + this.node + '"';
                };

                ActionService.register(actionGroupTypes.WEB, actionTypes[actionGroupTypes.WEB].CLICK, ClickWebAction);

                return ClickWebAction;
            }])
}());
