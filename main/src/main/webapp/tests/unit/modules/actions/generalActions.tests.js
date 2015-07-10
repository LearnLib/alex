describe('generalActions', function () {
    var ExecuteSymbolGeneralAction,
        IncrementCounterGeneralAction,
        SetCounterGeneralAction,
        SetVariableByCookieAction,
        SetVariableByJsonAttributeGeneralAction,
        SetVariableByNodeGeneralAction,
        SetVariableGeneralAction,
        WaitGeneralAction;

    beforeEach(angular.mock.module('ALEX'));
    beforeEach(angular.mock.module('ALEX.actions'));
    beforeEach(angular.mock.inject(function ($injector) {

        ExecuteSymbolGeneralAction = $injector.get('ExecuteSymbolGeneralAction');
        IncrementCounterGeneralAction = $injector.get('IncrementCounterGeneralAction');
        SetCounterGeneralAction = $injector.get('SetCounterGeneralAction');
        SetVariableByCookieAction = $injector.get('SetVariableByCookieAction');
        SetVariableByJsonAttributeGeneralAction = $injector.get('SetVariableByJsonAttributeGeneralAction');
        SetVariableByNodeGeneralAction = $injector.get('SetVariableByNodeGeneralAction');
        SetVariableGeneralAction = $injector.get('SetVariableGeneralAction');
        WaitGeneralAction = $injector.get('WaitGeneralAction');
    }));

    function hasRequiredProperties(obj, properties) {
        for (var key in properties) {
            if (angular.isUndefined(obj[key])) {
                return false;
            }
            if (!angular.equals(obj[key], properties[key])) {
                return false;
            }
        }
        return true;
    }

    it('ExecuteSymbolGeneralAction: should instantiate a correct action', function () {
        var action = new ExecuteSymbolGeneralAction();
        expect(hasRequiredProperties(action, {
            type: 'executeSymbol',
            negated: false,
            ignoreFailure: false,
            disabled: false,
            symbolToExecute: {id: null, revision: null}
        })).toBeTruthy();
    });

    it('IncrementCounterGeneralAction: should instantiate a correct action', function () {
        var action = new IncrementCounterGeneralAction();
        expect(hasRequiredProperties(action, {
            type: 'incrementCounter',
            negated: false,
            ignoreFailure: false,
            disabled: false,
            name: null
        })).toBeTruthy();
    });

    it('SetCounterGeneralAction: should instantiate a correct action', function () {
        var action = new SetCounterGeneralAction();
        expect(hasRequiredProperties(action, {
            type: 'setCounter',
            negated: false,
            ignoreFailure: false,
            disabled: false,
            name: null,
            value: null
        })).toBeTruthy();
    });

    it('SetVariableByCookieAction: should instantiate a correct action', function () {
        var action = new SetVariableByCookieAction();
        expect(hasRequiredProperties(action, {
            type: 'setVariableByCookie',
            negated: false,
            ignoreFailure: false,
            disabled: false,
            name: null,
            value: null,
            cookieType: 'WEB'
        })).toBeTruthy();
    });

    it('SetVariableByJsonAttributeGeneralAction: should instantiate a correct action', function () {
        var action = new SetVariableByJsonAttributeGeneralAction();
        expect(hasRequiredProperties(action, {
            type: 'setVariableByJSON',
            negated: false,
            ignoreFailure: false,
            disabled: false,
            name: null,
            value: null
        })).toBeTruthy();
    });

    it('SetVariableByNodeGeneralAction: should instantiate a correct action', function () {
        var action = new SetVariableByNodeGeneralAction();
        expect(hasRequiredProperties(action, {
            type: 'setVariableByHTML',
            negated: false,
            ignoreFailure: false,
            disabled: false,
            name: null,
            value: null
        })).toBeTruthy();
    });

    it('SetVariableGeneralAction: should instantiate a correct action', function () {
        var action = new SetVariableGeneralAction();
        expect(hasRequiredProperties(action, {
            type: 'setVariable',
            negated: false,
            ignoreFailure: false,
            disabled: false,
            name: null,
            value: null
        })).toBeTruthy();
    });

    it('WaitGeneralAction: should instantiate a correct action', function () {
        var action = new WaitGeneralAction();
        expect(hasRequiredProperties(action, {
            type: 'wait',
            negated: false,
            ignoreFailure: false,
            disabled: false,
            duration: 0
        })).toBeTruthy();
    });
});