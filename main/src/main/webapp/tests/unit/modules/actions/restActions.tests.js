describe('restActions', function () {
    var CallRestAction,
        CheckAttributeExistsRestAction,
        CheckAttributeTypeRestAction,
        CheckAttributeValueRestAction,
        CheckHeaderFieldRestAction,
        CheckHTTPBodyTextRestAction,
        CheckStatusRestAction;

    beforeEach(angular.mock.module('ALEX'));
    beforeEach(angular.mock.module('ALEX.actions'));
    beforeEach(angular.mock.inject(function ($injector) {

        CallRestAction = $injector.get('CallRestAction');
        CheckAttributeExistsRestAction = $injector.get('CheckAttributeExistsRestAction');
        CheckAttributeTypeRestAction = $injector.get('CheckAttributeTypeRestAction');
        CheckAttributeValueRestAction = $injector.get('CheckAttributeValueRestAction');
        CheckHeaderFieldRestAction = $injector.get('CheckHeaderFieldRestAction');
        CheckHTTPBodyTextRestAction = $injector.get('CheckHTTPBodyTextRestAction');
        CheckStatusRestAction = $injector.get('CheckStatusRestAction');
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

    // CallRestAction
    it('CallRestAction: should instantiate a correct action', function () {
        var action = new CallRestAction();
        expect(hasRequiredProperties(action, {
            type: 'rest_call',
            negated: false,
            ignoreFailure: false,
            disabled: false,
            method: null,
            url: null,
            data: null,
            cookies: {},
            headers: {}
        })).toBeTruthy();
    });

    it('CallRestAction: should add and remove cookies', function () {
        var action = new CallRestAction();
        action.addCookie('name', 'value');
        expect(action.cookies.name).toEqual('value');

        action.removeCookie('name');
        expect(action.cookies.name).toBeUndefined();
    });

    it('CallRestAction: should add and remove cookies', function () {
        var action = new CallRestAction();
        action.addHeader('name', 'value');
        expect(action.headers.name).toEqual('value');

        action.removeHeader('name');
        expect(action.headers.name).toBeUndefined();
    });

    // CheckAttributeExistsRestAction
    it('CheckAttributeExistsRestAction: should instantiate a correct action', function () {
        var action = new CheckAttributeExistsRestAction();
        expect(hasRequiredProperties(action, {
            type: 'rest_checkAttributeExists',
            negated: false,
            ignoreFailure: false,
            disabled: false,
            attribute: null
        })).toBeTruthy();
    });

    // CheckAttributeTypeRestAction
    it('CheckAttributeTypeRestAction: should instantiate a correct action', function () {
        var action = new CheckAttributeTypeRestAction();
        expect(hasRequiredProperties(action, {
            type: 'rest_checkAttributeType',
            negated: false,
            ignoreFailure: false,
            disabled: false,
            attribute: null,
            jsonType: null
        })).toBeTruthy();
    });

    // CheckAttributeValueRestAction
    it('CheckAttributeValueRestAction: should instantiate a correct action', function () {
        var action = new CheckAttributeValueRestAction();
        expect(hasRequiredProperties(action, {
            type: 'rest_checkAttributeValue',
            negated: false,
            ignoreFailure: false,
            disabled: false,
            attribute: null,
            value: null,
            regexp: false
        })).toBeTruthy();
    });

    // CheckHeaderFieldRestAction
    it('CheckHeaderFieldRestAction: should instantiate a correct action', function () {
        var action = new CheckHeaderFieldRestAction();
        expect(hasRequiredProperties(action, {
            type: 'rest_checkHeaderField',
            negated: false,
            ignoreFailure: false,
            disabled: false,
            key: null,
            value: null,
            regexp: false
        })).toBeTruthy();
    });

    // CheckHTTPBodyTextRestAction
    it('CheckHTTPBodyTextRestAction: should instantiate a correct action', function () {
        var action = new CheckHTTPBodyTextRestAction();
        expect(hasRequiredProperties(action, {
            type: 'rest_checkForText',
            negated: false,
            ignoreFailure: false,
            disabled: false,
            value: null,
            regexp: false
        })).toBeTruthy();
    });

    // CheckStatusRestAction
    it('CheckStatusRestAction: should instantiate a correct action', function () {
        var action = new CheckStatusRestAction();
        expect(hasRequiredProperties(action, {
            type: 'rest_checkStatus',
            negated: false,
            ignoreFailure: false,
            disabled: false,
            status: null
        })).toBeTruthy();
    });
});