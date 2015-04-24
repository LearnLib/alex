(function () {
    'use strict';

    angular
        .module('ALEX.actions')
        .factory('FillWebAction', ['ActionService', 'AbstractAction', 'actionGroupTypes', 'actionTypes',
            function (ActionService, AbstractAction, actionGroupTypes, actionTypes) {

                function FillWebAction(node, value) {
                    AbstractAction.call(this, actionTypes[actionGroupTypes.WEB].FILL);
                    this.node = node || null;
                    this.value = value || null
                }

                FillWebAction.prototype.toString = function () {
                    return 'Fill element "' + this.node + '" with "' + this.value + '"';
                };

                ActionService.register(actionGroupTypes.WEB, actionTypes[actionGroupTypes.WEB].FILL, FillWebAction);

                return FillWebAction;
            }])
}());
