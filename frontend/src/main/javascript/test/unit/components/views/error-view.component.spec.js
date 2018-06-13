describe('ErrorViewComponent', () => {
    let $controller;
    let $compile;
    let $rootScope;
    let scope;
    let $state;
    let controller;

    beforeEach(angular.mock.module('ALEX'));
    beforeEach(angular.mock.inject((_$controller_, _$compile_ ,_$rootScope_, _$state_) => {
        $state = _$state_;
        scope = _$rootScope_.$new();
        $controller = _$controller_;
        $compile = _$compile_;
        $rootScope = _$rootScope_;

        spyOn($state, 'go').and.callThrough();
    }));

    function createController() {
        const element = angular.element("<error-view></error-view>");
        const renderedElement = $compile(element)($rootScope);
        $rootScope.$digest();
        controller = element.controller('errorView');
    }

    it('should display an error if there is a message', () => {
        const message = 'something failed';
        createController();
        $state.go('error');
        scope.$digest();

        expect($state.current.name).toEqual('error');
        expect(controller.errorMessage).toEqual(message);
    });

    it('should redirect to home if there is no message to display', () => {
        createController();
        expect(controller.errorMessage).toBeNull();
        $state.go('error');
        scope.$digest();

        expect($state.go).toHaveBeenCalledWith('home')
    });
});
