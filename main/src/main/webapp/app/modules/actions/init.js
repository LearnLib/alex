(function () {
    'use strict';

    angular
        .module('ALEX.actions', [])
        .run(['$injector', function ($injector) {
            // have to inject actions here so that they
            // are instantiated and registered on startup

            // register web actions in module
            $injector.get('ClickWebAction');
            $injector.get('CheckForTextWebAction');
            $injector.get('CheckForNodeWebAction');
            $injector.get('CheckPageTitleAction');
            $injector.get('ClearWebAction');
            $injector.get('ClickLinkByTextWebAction');
            $injector.get('FillWebAction');
            $injector.get('GoToWebAction');
            $injector.get('SelectWebAction');
            $injector.get('SubmitWebAction');

            // register rest actions in module
            $injector.get('CallRestAction');
            $injector.get('CheckAttributeExistsRestAction');
            $injector.get('CheckAttributeTypeRestAction');
            $injector.get('CheckAttributeValueRestAction');
            $injector.get('CheckHeaderFieldRestAction');
            $injector.get('CheckHTTPBodyTextRestAction');
            $injector.get('CheckStatusRestAction');

            // register general actions in module
            $injector.get('ExecuteSymbolGeneralAction');
            $injector.get('IncrementCounterGeneralAction');
            $injector.get('SetCounterGeneralAction');
            $injector.get('SetVariableByCookieAction');
            $injector.get('SetVariableByJsonAttributeGeneralAction');
            $injector.get('SetVariableByNodeGeneralAction');
            $injector.get('SetVariableGeneralAction');
            $injector.get('WaitGeneralAction');
        }]);
}());