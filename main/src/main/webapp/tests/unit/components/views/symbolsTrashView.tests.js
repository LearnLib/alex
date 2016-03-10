import {Symbol} from '../../../../src/js/entities/Symbol';

describe('symbolsTrashView', () => {

    let $rootScope, $compile, $q, SessionService, SymbolResource, ToastService;
    let controller, project, user, symbols;
    let element, renderedElement;

    beforeEach(angular.mock.module('ALEX'));
    beforeEach(angular.mock.inject($injector => {
        $rootScope = $injector.get('$rootScope');
        $compile = $injector.get('$compile');
        $q = $injector.get('$q');
        SessionService = $injector.get('SessionService');
        SymbolResource = $injector.get('SymbolResource');
        ToastService = $injector.get('ToastService');


        symbols = ENTITIES.symbols.map(s => new Symbol(s));
        project = ENTITIES.projects[0];
        user = ENTITIES.users[0];

        SessionService.saveProject(project);
        SessionService.saveUser(user);
    }));

    afterEach(() => {
        SessionService.removeProject();
        SessionService.removeUser();
    });

    function createComponent() {
        element = angular.element("<symbols-trash-view></symbols-trash-view>");
        renderedElement = $compile(element)($rootScope);
        $rootScope.$digest();
        controller = element.controller('symbolsTrashView');
    }

    function prepareComponent() {
        const deferred = $q.defer();
        spyOn(SymbolResource, 'getAll').and.returnValue(deferred.promise);
        deferred.resolve(symbols);
    }

    it('should load all deleted symbols on init', () => {
        prepareComponent();
        createComponent();
        $rootScope.$digest();

        expect(SymbolResource.getAll).toHaveBeenCalledWith(project.id, true);
        expect(controller.symbols).toEqual(symbols);
    });

    it('should recover a single symbol', () => {
        prepareComponent();
        createComponent();
        $rootScope.$digest();

        const symbol = symbols[0];
        const deferred = $q.defer();

        spyOn(ToastService, 'success').and.callThrough();
        spyOn(SymbolResource, 'recover').and.returnValue(deferred.promise);

        controller.recoverSymbol(symbol);
        deferred.resolve();
        $rootScope.$digest();

        expect(ToastService.success).toHaveBeenCalled();
        expect(SymbolResource.recover).toHaveBeenCalledWith(symbol);
        expect(controller.symbols.indexOf(symbol)).toBe(-1);
    });

    it('should fail to recover a single symbol', () => {
        prepareComponent();
        createComponent();
        $rootScope.$digest();

        const symbol = symbols[0];
        const deferred = $q.defer();

        spyOn(ToastService, 'danger').and.callThrough();
        spyOn(SymbolResource, 'recover').and.returnValue(deferred.promise);

        controller.recoverSymbol(symbol);
        deferred.reject({data: {message: null}});
        $rootScope.$digest();

        expect(ToastService.danger).toHaveBeenCalled();
        expect(SymbolResource.recover).toHaveBeenCalledWith(symbol);
        expect(controller.symbols.indexOf(symbol)).not.toBe(-1);
    });

    it('should do nothing if there are no symbols selected', () => {
        prepareComponent();
        createComponent();
        $rootScope.$digest();

        spyOn(SymbolResource, 'recoverMany').and.callThrough();

        controller.recoverSelectedSymbols();
        $rootScope.$digest();

        expect(SymbolResource.recoverMany).not.toHaveBeenCalled();
    });

    it('should recover all selected symbols', () => {
        prepareComponent();
        createComponent();
        $rootScope.$digest();

        const selectedSymbols = [
            controller.symbols[0],
            controller.symbols[1]
        ];

        controller.selectedSymbols = selectedSymbols;

        const deferred = $q.defer();

        spyOn(ToastService, 'success').and.callThrough();
        spyOn(SymbolResource, 'recoverMany').and.returnValue(deferred.promise);

        controller.recoverSelectedSymbols();
        deferred.resolve();
        $rootScope.$digest();

        expect(ToastService.success).toHaveBeenCalled();
        expect(SymbolResource.recoverMany).toHaveBeenCalledWith(selectedSymbols);
        selectedSymbols.forEach(s => expect(controller.symbols.indexOf(s)).toBe(-1));
    });

    it('should fail to recover selected symbols', () => {
        prepareComponent();
        createComponent();
        $rootScope.$digest();

        const selectedSymbols = [
            controller.symbols[0],
            controller.symbols[1]
        ];

        controller.selectedSymbols = selectedSymbols;

        const deferred = $q.defer();

        spyOn(ToastService, 'danger').and.callThrough();
        spyOn(SymbolResource, 'recoverMany').and.returnValue(deferred.promise);

        controller.recoverSelectedSymbols();
        deferred.reject({data: {message: null}});
        $rootScope.$digest();

        expect(ToastService.danger).toHaveBeenCalled();
        expect(SymbolResource.recoverMany).toHaveBeenCalledWith(selectedSymbols);
        selectedSymbols.forEach(s => expect(controller.symbols.indexOf(s)).not.toBe(-1));
    })
});