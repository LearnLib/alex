describe('EventBus', () => {
    const EVENT = 'testEvent';

    let EventBus;
    let $rootScope;
    let scope;

    beforeEach(module('ALEX'));
    beforeEach(inject((_$rootScope_, _EventBus_) => {
        EventBus = _EventBus_;
        $rootScope = _$rootScope_;
        scope = _$rootScope_.$new();
    }));

    it('should register an event correctly', () => {
        EventBus.on(EVENT, (evt, data) => {
            expect(data.testData).toEqual('test');
        }, scope);
        expect(angular.isArray($rootScope.$$listeners[EVENT])).toBeTruthy();
        EventBus.emit(EVENT, {testData: 'test'});
    });

    it('should remove a listener on scope destroy', () => {
        EventBus.on(EVENT, (evt, data) => {
            expect(data.testData).toEqual('test');
        }, scope);
        scope.$destroy();
        expect($rootScope.$$listeners[EVENT]).toEqual([null]);
    });
});