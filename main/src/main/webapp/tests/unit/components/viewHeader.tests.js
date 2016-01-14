describe('viewHeader', () => {
    let $rootScope;
    let $compile;
    let $http;
    let renderedElement;
    let controller;

    beforeEach(angular.mock.module('ALEX'));
    beforeEach(angular.mock.inject((_$rootScope_, _$compile_, _$http_) => {
        $rootScope = _$rootScope_;
        $compile = _$compile_;
        $http = _$http_;
    }));

    it('should not display any text without given property', () => {
        const element = angular.element("<view-header></view-header>");
        renderedElement = $compile(element)($rootScope);
        $rootScope.$digest();
        controller = element.controller('viewHeader');

        expect(controller.title).toBeNull();
        expect(element.children().length).toEqual(1);
    });

    it('should display a given text in the header if it has been passed', () => {
        const title = 'Page Title';

        const element = angular.element(`<view-header title='${title}'></view-header>`);
        renderedElement = $compile(element)($rootScope);
        $rootScope.$digest();
        controller = element.controller('viewHeader');

        expect(controller.title).toEqual(title);
        expect(element.children().length).toEqual(1);
        expect(renderedElement.html()).toContain(title);
    });

    it('should display the text that is given in between the tags', () => {
        const title = 'Page Title';
        const subTitle = 'Sub Title';

        const element = angular.element(`<view-header title='${title}'>${subTitle}</view-header>`);
        renderedElement = $compile(element)($rootScope);
        $rootScope.$digest();
        controller = element.controller('viewHeader');

        expect(controller.title).toEqual(title);
        expect(element.children().length).toEqual(1);
        expect(renderedElement.html()).toContain(title);
        expect(renderedElement.html()).toContain(subTitle);
    })
});