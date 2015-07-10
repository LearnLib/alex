describe('webActions', function () {
    var CheckForTextWebAction,
        CheckForNodeWebAction,
        CheckPageTitleAction,
        ClearWebAction,
        ClickLinkByTextWebAction,
        ClickWebAction,
        FillWebAction,
        GoToWebAction,
        SelectWebAction,
        SubmitWebAction;

    beforeEach(angular.mock.module('ALEX'));
    beforeEach(angular.mock.module('ALEX.actions'));
    beforeEach(angular.mock.inject(function ($injector) {
        CheckForTextWebAction = $injector.get('CheckForTextWebAction');
        CheckForNodeWebAction = $injector.get('CheckForNodeWebAction');
        CheckPageTitleAction = $injector.get('CheckPageTitleAction');
        ClearWebAction = $injector.get('ClearWebAction');
        ClickLinkByTextWebAction = $injector.get('ClickLinkByTextWebAction');
        ClickWebAction = $injector.get('ClickWebAction');
        FillWebAction = $injector.get('FillWebAction');
        GoToWebAction = $injector.get('GoToWebAction');
        SelectWebAction = $injector.get('SelectWebAction');
        SubmitWebAction = $injector.get('SubmitWebAction');
    }));

    function hasRequiredProperties(obj, properties) {
        for (var key in properties) {
            console.log(obj[key], properties[key]);
            if (angular.isUndefined(obj[key])) {
                return false;
            }
            if (!angular.equals(obj[key], properties[key])) {
                return false;
            }
        }
        return true;
    }

    it('CheckForTextWebAction: should correctly instantiate the action', function () {
        var action = new CheckForTextWebAction();
        expect(hasRequiredProperties({
            type: 'web_checkForText',
            negated: false,
            disabled: false,
            ignoreFailure: false,
            value: null,
            regexp: false
        }), action).toBeTruthy();
    });

    it('CheckForNodeWebAction: should correctly instantiate the action', function () {
        var action = new CheckForNodeWebAction();
        expect(hasRequiredProperties({
            type: 'web_checkForNode',
            negated: false,
            disabled: false,
            ignoreFailure: false,
            value: null
        }), action).toBeTruthy();
    });

    it('CheckPageTitleAction: should correctly instantiate the action', function () {
        var action = new CheckPageTitleAction();
        expect(hasRequiredProperties({
            type: 'web_checkPageTitle',
            negated: false,
            disabled: false,
            ignoreFailure: false,
            title: null,
            regexp: false
        }), action).toBeTruthy();
    });

    it('ClearWebAction: should correctly instantiate the action', function () {
        var action = new ClearWebAction();
        expect(hasRequiredProperties({
            type: 'web_clear',
            negated: false,
            disabled: false,
            ignoreFailure: false,
            node: null
        }), action).toBeTruthy();
    });

    it('ClickLinkByTextWebAction: should correctly instantiate the action', function () {
        var action = new ClickLinkByTextWebAction();
        expect(hasRequiredProperties({
            type: 'web_clickLinkByText',
            negated: false,
            disabled: false,
            ignoreFailure: false,
            value: null
        }), action).toBeTruthy();
    });

    it('ClickWebAction: should correctly instantiate the action', function () {
        var action = new ClickWebAction();
        expect(hasRequiredProperties({
            type: 'web_click',
            negated: false,
            disabled: false,
            ignoreFailure: false,
            node: null
        }), action).toBeTruthy();
    });

    it('FillWebAction: should correctly instantiate the action', function () {
        var action = new FillWebAction();
        expect(hasRequiredProperties({
            type: 'web_fill',
            negated: false,
            disabled: false,
            ignoreFailure: false,
            node: null,
            value: null
        }), action).toBeTruthy();
    });

    it('GoToWebAction: should correctly instantiate the action', function () {
        var action = new GoToWebAction();
        expect(hasRequiredProperties({
            type: 'web_goto',
            negated: false,
            disabled: false,
            ignoreFailure: false,
            url: null
        }), action).toBeTruthy();
    });

    it('SelectWebAction: should correctly instantiate the action', function () {
        var action = new SelectWebAction();
        expect(hasRequiredProperties({
            type: 'web_select',
            negated: false,
            disabled: false,
            ignoreFailure: false,
            node: null,
            value: null,
            selectBy: 'TEXT'
        }), action).toBeTruthy();
    });

    it('SubmitWebAction: should correctly instantiate the action', function () {
        var action = new SubmitWebAction();
        expect(hasRequiredProperties({
            type: 'web_submit',
            negated: false,
            disabled: false,
            ignoreFailure: false,
            node: null
        }), action).toBeTruthy();
    })
});