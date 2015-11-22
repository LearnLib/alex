describe('checkbox', () => {
    let $rootScope;
    let $compile;
    let renderedElement;
    let controller;
    let element;

    beforeEach(module('ALEX'));
    beforeEach(inject((_$rootScope_, _$compile_) => {
        $rootScope = _$rootScope_;
        $compile = _$compile_;

        element = angular.element('<checkbox model="{}"></checkbox>');
        renderedElement = $compile(element)($rootScope);
        $rootScope.$digest();

        controller = element.controller('checkbox');
    }));

    it('should select the item if it is not selected', () => {
        expect(controller.model['_selected']).toBeUndefined();
        controller.toggleSelectItem();
        expect(controller.model['_selected']).toBe(true);
    });

    it('should deselect the item if it is selected', () => {
        controller.model['_selected'] = true;
        controller.toggleSelectItem();
        expect(controller.model['_selected']).toBe(false);
    });

    it('should select the item on click if it has not been selected yet', () => {
        renderedElement.find('span')[0].click();
        expect(controller.model['_selected']).toBe(true);
    });

    it('should deselect the item on click if it has been selected yet', () => {
        controller.model['_selected'] = true;
        renderedElement.find('span')[0].click();
        expect(controller.model['_selected']).toBe(false);
    });
});