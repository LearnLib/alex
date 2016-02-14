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
        createComponent();
        spyOn(controller, 'updateSymbol').and.returnValue(null);
        const data = {newSymbol: ENTITIES.symbols[0], oldSymbol: ENTITIES.symbols[1]};
        EventBus.emit(events.SYMBOL_UPDATED, data);
        $rootScope.$digest();
        expect(controller.updateSymbol).toHaveBeenCalledWith(data.newSymbol);
    });

    it('should display all symbols from a file on event: FILE_LOADED', () => {
        createComponent();
        spyOn(controller, 'fileLoaded').and.returnValue(null);
        const file = {name: 'filename'};
        EventBus.emit(events.FILE_LOADED, {file: file});
        $rootScope.$digest();
        expect(controller.fileLoaded).toHaveBeenCalledWith(file);
    });

    it('should load all symbols from a file', () => {
        createComponent();
        const symbols = ENTITIES.symbols.map(s => new Symbol(s));
        const json = angular.toJson(symbols);
        controller.fileLoaded(json);
        controller.symbols.forEach((s,i) => {
            expect(s instanceof Symbol).toBe(true);
            expect(s.id).toBeDefined();
            expect(s.name).toEqual(symbols[i].name);
            expect(s.abbreviation).toEqual(symbols[i].abbreviation);
            expect(s.actions).toEqual(symbols[i].actions);
        })
    });

    it('should show a message if the file does not contain json', () => {
        createComponent();
        spyOn(ToastService, 'danger').and.callThrough();
        const nonJson = 'asdasd0';
        controller.fileLoaded(nonJson);
        expect(controller.symbols).toEqual([]);
        expect(ToastService.danger).toHaveBeenCalled();
    });

    it('should do nothing on import if no symbols are selected', () => {
        createComponent();
        controller.fileLoaded(angular.toJson(ENTITIES.symbols));
        spyOn(SymbolResource, 'createMany').and.callThrough();

        const pre = controller.symbols;
        expect(controller.selectedSymbols.length).toEqual(0);
        controller.uploadSelectedSymbols();
        expect(controller.symbols).toEqual(pre);

        expect(SymbolResource.createMany).not.toHaveBeenCalled();
    });

    it('should import all selected symbols', () => {
        // TODO
    });

    it('should fail to import selected symbols', () => {
        // TODO
    });

    it('should update a symbol', () => {
        createComponent();
        spyOn(ToastService, 'success').and.callThrough();

        controller.fileLoaded(angular.toJson(ENTITIES.symbols));
        const updatedSymbol = controller.symbols[0];
        updatedSymbol.name = 'newName';

        controller.updateSymbol(updatedSymbol);
        expect(controller.symbols[0].name).toEqual('newName');
        expect(ToastService.success).toHaveBeenCalled();
    });

    it('should not update a symbol if the abbreviation already exists', () => {
        createComponent();
        spyOn(ToastService, 'success').and.callThrough();

        controller.fileLoaded(angular.toJson(ENTITIES.symbols));
        controller.updateSymbol({
            id: -2,
            name: 'name',
            abbreviation: controller.symbols[0].name
        });

        expect(ToastService.success).not.toHaveBeenCalled();
    });

    it('should not update a symbol if the name already exists', () => {
        createComponent();
        spyOn(ToastService, 'success').and.callThrough();

        controller.fileLoaded(angular.toJson(ENTITIES.symbols));
        controller.updateSymbol({
            id: -2,
            name: controller.symbols[0].name,
            abbreviation: 'abbr'
        });

        expect(ToastService.success).not.toHaveBeenCalled();
    })
});