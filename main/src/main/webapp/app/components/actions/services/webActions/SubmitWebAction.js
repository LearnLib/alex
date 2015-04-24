(function () {
    'use strict';

    angular
        .module('ALEX.actions')
        .factory('SubmitWebAction', ['ActionService', 'AbstractAction', 'actionGroupTypes', 'actionTypes',
            function (ActionService, AbstractAction, actionGroupTypes, actionTypes) {

                function SubmitWebAction(node) {
                    AbstractAction.call(this, actionTypes[actionGroupTypes.WEB].SUBMIT);
                    this.node = node || null;
                }

                SubmitWebAction.prototype.toString = function () {
                    return 'Submit element "' + this.node + '"';
                };

                ActionService.register(actionGroupTypes.WEB, actionTypes[actionGroupTypes.WEB].SUBMIT, SubmitWebAction);

                return SubmitWebAction;
            }])
}());
