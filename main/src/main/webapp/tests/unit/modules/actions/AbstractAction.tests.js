describe('AbstractAction', function () {
    var AbstractAction;

    beforeEach(angular.mock.module('ALEX'));
    beforeEach(angular.mock.module('ALEX.actions'));
    beforeEach(angular.mock.inject(function ($injector) {
        AbstractAction = $injector.get('AbstractAction');
    }));

    it('should corretly create an Abstract Action', function () {
        var action = new AbstractAction('sometype');
        expect(action.type).toEqual('sometype');
        expect(action.negated).toBeFalsy();
        expect(action.ignoreFailure).toBeFalsy();
        expect(action.disabled).toBeFalsy();
    });

    it('should add a property to an action', function () {
        var action = new AbstractAction('sometype');

        expect(action['newProperty']).toBeUndefined();
        action.set('newProperty', 'value');
        expect(action['newProperty']).toEqual('value')
    })
});