(function () {
    'use strict';

    angular
        .module('ALEX.actions')
        .factory('GoToWebAction', ['ActionService', 'AbstractAction', 'actionGroupTypes', 'actionTypes',
            function (ActionService, AbstractAction, actionGroupTypes, actionTypes) {

                function GoToWebAction(url) {
                    AbstractAction.call(this, actionTypes[actionGroupTypes.WEB].GO_TO);
                    this.url = url || null;
                }

                GoToWebAction.prototype.toString = function () {
                    return 'Go to URL "' + this.url + '"';
                };

                ActionService.register(actionGroupTypes.WEB, actionTypes[actionGroupTypes.WEB].GO_TO, GoToWebAction);

                return GoToWebAction;
            }])
}());
