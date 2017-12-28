import {AboutView} from '../../../../src/js/components/views/aboutView';

describe('aboutView', () => {
    let $rootScope, $compile;
    let controller, element, renderedElement;

    beforeEach(angular.mock.module('ALEX'));
    beforeEach(angular.mock.inject($injector => {
        $rootScope = $injector.get('$rootScope');
        $compile = $injector.get('$compile');
        $rootScope.$apply();
    }));

    function createComponent() {
        element = angular.element("<about-view></about-view>");
        renderedElement = $compile(element)($rootScope);
        $rootScope.$digest();
        controller = element.controller('aboutView');
    }

    it('should correctly render the component', () => {
        createComponent();
        expect(controller instanceof AboutView).toBe(true);
    });
});