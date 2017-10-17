describe('widget', () => {
    let $rootScope;
    let $compile;
    let renderedElement;

    beforeEach(angular.mock.module('ALEX'));
    beforeEach(angular.mock.inject((_$rootScope_, _$compile_) => {
        $rootScope = _$rootScope_;
        $compile = _$compile_;
    }));

    it('should display a title in the header if a title has been specified', () => {
        const element = angular.element('<widget title="this is a widget"></widget>');
        renderedElement = $compile(element)($rootScope);
        $rootScope.$digest();

        expect(renderedElement.html()).toContain("this is a widget");
    });

    it('should render children into the panel body', () => {
        const element = angular.element(`
            <widget title="this is a widget">
                <div id="testElement"></div>
            </widget>`);
        renderedElement = $compile(element)($rootScope);
        $rootScope.$digest();

        expect(renderedElement[0].querySelector('#testElement')).not.toBeNull();
    })
});