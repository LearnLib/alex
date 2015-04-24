(function () {
    'use strict';

    angular
        .module('ALEX.actions')
        .factory('SelectWebAction', ['ActionService', 'AbstractAction', 'actionGroupTypes', 'actionTypes',
            function (ActionService, AbstractAction, actionGroupTypes, actionTypes) {

                function SelectWebAction(node, value) {
                    AbstractAction.call(this, actionTypes[actionGroupTypes.WEB].SELECT);
                    this.node = node || null;
                    this.value = value || null;
                }

                SelectWebAction.prototype.toString = function () {
                    return 'Select value "' + this.value + '" from select input "' + this.node + '"';
                };

                ActionService.register(actionGroupTypes.WEB, actionTypes[actionGroupTypes.WEB].SELECT, SelectWebAction);

                return SelectWebAction;
            }])
}());
