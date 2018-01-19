describe('responsiveIframe', () => {
    let $rootScope, $compile;
    let renderedElement, controller;
    let div;

    beforeEach(angular.mock.module('ALEX'));
    beforeEach(angular.mock.inject(($injector) => {
        $rootScope = $injector.get('$rootScope');
        $compile = $injector.get('$compile');

        div = angular.element(`<div></div>`);
        const element = angular.element(`<responsive-iframe></responsive-iframe>`);
        div.append(element);
        renderedElement = $compile(element)($rootScope);
        $rootScope.$digest();
        controller = element.controller('responsiveIframe');

        document.body.appendChild(div[0]);
    }));

    afterEach(() => {
        document.body.removeChild(div[0]);
    });

    it('should have initialized properly', () => {
        expect(controller.iframe.nodeName.toLowerCase()).toEqual('iframe');
        expect(controller.container.nodeName.toLowerCase()).toEqual('div');
    });

    it('should adjust the size of the iframe to the size of its parent', () => {
        const width = controller.container.offsetWidth;
        const height = controller.container.offsetHeight;

        controller.fitToParent();
        expect(parseInt(controller.iframe.getAttribute('width'))).toEqual(width);
        expect(parseInt(controller.iframe.getAttribute('height'))).toEqual(height);
    })
});