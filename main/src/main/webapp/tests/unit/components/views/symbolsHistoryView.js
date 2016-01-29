import {Symbol} from '../../../../app/modules/entities/Symbol';

describe('symbolsHistoryView', () => {
    const SYMBOL_ID = 1;

    let $rootScope, $compile, $q, $stateParams, SessionService, SymbolResource, ToastService, ErrorService;
    let controller, project, user, symbols;
    let element, renderedElement;

    beforeEach(angular.mock.module('ALEX'));
    beforeEach(angular.mock.inject($injector => {
        $rootScope = $injector.get('$rootScope');
        $compile = $injector.get('$compile');
        $stateParams = $injector.get('$stateParams');
        $q = $injector.get('$q');
        SessionService = $injector.get('SessionService');
        SymbolResource = $injector.get('SymbolResource');
        ToastService = $injector.get('ToastService');
        ErrorService = $injector.get('ErrorService');

        symbols = ENTITIES.symbols.map(s => new Symbol(s));
        project = ENTITIES.projects[0];
        user = ENTITIES.users[0];

        SessionService.saveProject(project);
        SessionService.saveUser(user);

        // act like the url is open so that the controller has
        // access to the symbolId from the url
        $injector.get('$state').transitionTo('symbolsHistory', { symbolId: SYMBOL_ID });
        $rootScope.$apply();
    }));

    afterEach(() => {
        SessionService.removeProject();
        SessionService.removeUser();
    });

    function createComponent() {
        element = angular.element("<symbols-history-view></symbols-history-view>");
        renderedElement = $compile(element)($rootScope);
        $rootScope.$digest();
        controller = element.controller('symbolsHistoryView');
    }

    it('should load revisions of a symbol on init and split of the most current on', () => {
        const deferred = $q.defer();
        spyOn(SymbolResource, 'getRevisions').and.returnValue(deferred.promise);
        deferred.resolve(symbols);

        const copy = symbols.map(s => new Symbol(s));
        createComponent();
        $rootScope.$digest();

        expect(SymbolResource.getRevisions).toHaveBeenCalledWith(project.id, SYMBOL_ID);

        expect(controller.latestRevision).toEqual(copy[2]);
        expect(controller.revisions).toEqual([
            symbols[0], symbols[1]
        ]);
    });

    it('should go to the error page if the symbol id in the url is invalid', () => {
        const deferred = $q.defer();

        spyOn(ErrorService, 'setErrorMessage').and.callThrough();
        spyOn(SymbolResource, 'getRevisions').and.returnValue(deferred.promise);

        deferred.reject({data: {message: null}});
        createComponent();

        expect(SymbolResource.getRevisions).toHaveBeenCalled();
        expect(ErrorService.setErrorMessage).toHaveBeenCalled();
    });

    it('should restore a revision and set it as latest revision', () => {
        const d1 = $q.defer(), d2 = $q.defer();

        spyOn(ToastService, 'success').and.callThrough();
        spyOn(SymbolResource, 'getRevisions').and.returnValue(d1.promise);
        spyOn(SymbolResource, 'update').and.returnValue(d2.promise);

        d1.resolve(symbols);
        createComponent();

        const latestRevision = controller.latestRevision;
        const revisions = controller.revisions;
        const updatedSymbol = revisions[0];

        d2.resolve(updatedSymbol);
        controller.restoreRevision(updatedSymbol);
        $rootScope.$digest();

        expect(ToastService.success).toHaveBeenCalled();
        expect(controller.revisions.indexOf(latestRevision)).not.toBe(-1);
        expect(controller.latestRevision).toEqual(updatedSymbol);
    });

    it('should fail to restore a revision', () => {
        const d1 = $q.defer(), d2 = $q.defer();

        spyOn(ToastService, 'danger').and.callThrough();
        spyOn(SymbolResource, 'getRevisions').and.returnValue(d1.promise);
        spyOn(SymbolResource, 'update').and.returnValue(d2.promise);

        d1.resolve(symbols);
        createComponent();

        const latestRevision = controller.latestRevision;
        const revisions = controller.revisions;

        d2.reject({data: {message: null}});
        controller.restoreRevision(revisions[0]);
        $rootScope.$digest();

        expect(ToastService.danger).toHaveBeenCalled();
        expect(controller.latestRevision).toEqual(latestRevision);
        expect(controller.revisions).toEqual(revisions);
    });
});