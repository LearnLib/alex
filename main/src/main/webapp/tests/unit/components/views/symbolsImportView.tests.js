import {Symbol} from '../../../../app/modules/entities/Symbol';
import {events} from '../../../../app/modules/constants';

describe('symbolsImportView', () => {
    let $rootScope, $compile, SessionService, SymbolResource, ToastService, EventBus;
    let controller, project, user;
    let element, renderedElement;

    beforeEach(angular.mock.module('ALEX'));
    beforeEach(angular.mock.inject($injector => {
        $rootScope = $injector.get('$rootScope');
        $compile = $injector.get('$compile');
        SessionService = $injector.get('SessionService');
        SymbolResource = $injector.get('SymbolResource');
        ToastService = $injector.get('ToastService');
        EventBus = $injector.get('EventBus');

        project = ENTITIES.projects[0];
        user = ENTITIES.users[0];

        SessionService.saveProject(project);
        SessionService.saveUser(user);

        $rootScope.$apply();
    }));

    afterEach(() => {
        SessionService.removeProject();
        SessionService.removeUser();
    });

    function createComponent() {
        element = angular.element("<symbols-import-view></symbols-import-view>");
        renderedElement = $compile(element)($rootScope);
        $rootScope.$digest();
        controller = element.controller('symbolsImportView');
    }

    it('should update symbol on event: SYMBOL_UPDATED', () => {
        // TODO
    });

    it('should display all symbols from a file on event: FILE_LOADED', () => {
        // TODO
    });

    it('should load all symbols from a file', () => {
        // TODO
    });

    it('should import all selected symbols', () => {
        // TODO
    });

    it('should fail to import selected symbols', () => {
        // TODO
    });

    it('should update a symbol', () => {
        // TODO
    });
});