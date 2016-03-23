describe('actionCreateEditForm', () => {
    let $rootScope, $compile, $httpBackend, $q;
    let renderedElement, controller;
    const ACTION_TYPE = 'test-action';

    beforeEach(angular.mock.module('ALEX'));
    beforeEach(angular.mock.inject(($injector) => {
        $rootScope = $injector.get('$rootScope');
        $compile = $injector.get('$compile');
        $httpBackend = $injector.get('$httpBackend');
        $q = $injector.get('$q');

        const scope = $rootScope.$new();
        scope.symbols = [];
        scope.action = {
            type: ACTION_TYPE
        };

        const element = angular.element(`
            <action-create-edit-form symbols='symbols' action='action'></action-create-edit-form>
        `);
        renderedElement = $compile(element)(scope);
        controller = element.controller('actionCreateEditForm');
    }));

    it('should render correctly and load the template of an action', () => {
        spyOn(controller, 'getTemplate').and.callThrough();

        $httpBackend.whenGET(`html/actions/${ACTION_TYPE}.html`).respond(200, '');
        $rootScope.$digest();
        $httpBackend.flush();

        expect(controller.getTemplate).toHaveBeenCalled();
    });

    it('should load the right template of an action', () => {
        const template = controller.getTemplate();
        expect(template).toContain(ACTION_TYPE + '.html');
    });
});

