(function () {
    'use strict';

    angular
        .module('ALEX.services')
        .factory('ActionService', ActionService);

    // @ngInject
    function ActionService(ClearWebAction, ClickWebAction, CheckForTextWebAction, CheckForNodeWebAction,
                           CheckPageTitleAction, ClickLinkByTextWebAction, FillWebAction, GoToWebAction, SelectWebAction,
                           SubmitWebAction, CallRestAction, CheckAttributeExistsRestAction, CheckAttributeTypeRestAction,
                           CheckAttributeValueRestAction, CheckHeaderFieldRestAction, CheckHTTPBodyTextRestAction,
                           CheckStatusRestAction, AssertCounterAction, AssertVariableAction, ExecuteSymbolGeneralAction,
                           IncrementCounterGeneralAction, SetCounterGeneralAction, SetVariableGeneralAction,
                           SetVariableByCookieAction, SetVariableByJsonAttributeGeneralAction,
                           SetVariableByNodeGeneralAction, WaitGeneralAction) {

        // map: actionType {string} -> actionConstructor {fn}
        var actionMap = {};

        // register all actions
        for (var i = 0; i < arguments.length; i++) {
            var action = arguments[i];
            actionMap[action.type] = action;
        }

        function buildFromData(data) {
            var actionConstructor = actionMap[data.type];
            var action = new actionConstructor();
            for (var key in data) {
                if (key[0] !== '_') {
                    action.set(key, data[key]);
                }
            }
            return action;
        }

        function buildFromType(type) {
            return buildFromData({type: type});
        }

        return {
            buildFromData: buildFromData,
            buildFromType: buildFromType,
        };
    }
}());