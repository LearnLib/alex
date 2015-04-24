(function () {
    'use strict';

    angular
        .module('ALEX.actions')
        .factory('ClickLinkByTextWebAction', ['ActionService', 'AbstractAction', 'actionGroupTypes', 'actionTypes',
            function (ActionService, AbstractAction, actionGroupTypes, actionTypes) {

                function ClickLinkByTextWebAction(value) {
                    AbstractAction.call(this, actionTypes[actionGroupTypes.WEB].CLICK_LINK_BY_TEXT);
                    this.value = value || null;
                }

                ClickLinkByTextWebAction.prototype.toString = function () {
                    return 'Click on link with text "' + this.value + '"';
                };

                ActionService.register(actionGroupTypes.WEB, actionTypes[actionGroupTypes.WEB].CLICK_LINK_BY_TEXT, ClickLinkByTextWebAction);

                return ClickLinkByTextWebAction;
            }])
}());
