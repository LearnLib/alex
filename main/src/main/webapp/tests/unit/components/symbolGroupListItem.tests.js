describe('symbolGroupListItem', () => {
    let $rootScope, $controller, $q, $compile;
    let controller, scope;

    beforeEach(angular.mock.module('ALEX'));
    beforeEach(angular.mock.inject(($injector) => {
        $rootScope = $injector.get('$rootScope');
        $controller = $injector.get('$controller');
        $q = $injector.get('$q');
        $compile = $injector.get('$compile');

        scope = $rootScope.$new();
        scope.group = ENTITIES.groups[0];
    }));

    it('should display a link to edit the group', () => {
        const element = angular.element(`
            <symbol-group-list-item group="group"></symbol-group-list-item>
        `);
        $compile(element)(scope);
        controller = element.controller('symbolGroupListItem');

        expect(controller.editable).toBe(false);
    });

    it('should not display a link to edit the group', () => {
        const element = angular.element(`
            <symbol-group-list-item group="group" editable="true"></symbol-group-list-item>
        `);
        $compile(element)(scope);
        controller = element.controller('symbolGroupListItem');

        expect(controller.editable).toBe(true);
    });
});