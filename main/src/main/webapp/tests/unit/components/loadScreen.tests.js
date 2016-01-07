describe('loadScreen', () => {
    let $rootScope;
    let $compile;
    let $http;
    let renderedElement;
    let controller;

    beforeEach(module('ALEX'));
    beforeEach(inject((_$rootScope_, _$compile_, _$http_) => {
        $rootScope = _$rootScope_;
        $compile = _$compile_;
        $http = _$http_;

        const element = angular.element("<load-screen></load-screen>");
        renderedElement = $compile(element)($rootScope);
        $rootScope.$digest();

        controller = element.controller('loadScreen');
    }));

    it('should not be visible at start', () => {
        expect(controller.visible).toBeFalsy();
    });

    it('should not be displayed if there is no pending http request', () => {
        $http.pendingRequests = [];
        expect(controller.visible).toBeFalsy();
        expect(renderedElement.children().length).toEqual(0);
    });

    it('should be displayed as soon as there are pending http requests', () => {
        $http.pendingRequests.push(null);
        $rootScope.$digest();
        expect(controller.visible).toBeTruthy();
        expect(renderedElement.children().length).toEqual(1);
    })
});