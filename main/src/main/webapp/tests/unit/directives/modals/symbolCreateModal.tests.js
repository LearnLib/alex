import {SymbolFormModel, Symbol} from '../../../../src/js/entities/Symbol';
import {events} from '../../../../src/js/constants';
import {SymbolCreateModalController} from '../../../../src/js/directives/modals/symbolCreateModalHandle';

describe('symbolCreateModal', () => {
    let $controller, $uibModal, $q, $compile, $rootScope, SymbolGroupResource, SymbolResource, ToastService, SessionService;
    let modalInstance, controller, element, EventBus;

    beforeEach(angular.mock.module('ALEX'));
    beforeEach(angular.mock.inject(($injector) => {
        SymbolResource = $injector.get('SymbolResource');
        SymbolGroupResource = $injector.get('SymbolGroupResource');
        ToastService = $injector.get('ToastService');
        SessionService = $injector.get('SessionService');
        $controller = $injector.get('$controller');
        $q = $injector.get('$q');
        $uibModal = $injector.get('$uibModal');
        $compile = $injector.get('$compile');
        $rootScope = $injector.get('$rootScope');
        EventBus = $injector.get('EventBus');

        modalInstance = {
            close: jasmine.createSpy('modalInstance.close'),
            dismiss: jasmine.createSpy('modalInstance.dismiss'),
            result: {
                then: jasmine.createSpy('modalInstance.result.then')
            }
        };

        SessionService.saveProject(ENTITIES.projects[0]);
    }));
    afterEach(() => {
        SessionService.removeProject();
        document.body.innerHTML = '';
    });

    function createController() {
        const deferred = $q.defer();
        spyOn(SymbolGroupResource, 'getAll').and.returnValue(deferred.promise);
        deferred.resolve(ENTITIES.groups);

        controller = $controller(SymbolCreateModalController, {
            $uibModalInstance: modalInstance,
            SymbolResource: SymbolResource,
            SymbolGroupResource: SymbolGroupResource,
            ToastService: ToastService,
            SessionService: SessionService,
            EventBus: EventBus
        });

        expect(controller.groups).toEqual([]);

        $uibModal.open({
            templateUrl: 'html/modals/symbol-create-modal.html',
            controller: () => controller,
            controllerAs: 'vm'
        });

        $rootScope.$digest();

        expect(SymbolGroupResource.getAll).toHaveBeenCalled();
        expect(controller.groups.length > 0).toBe(true);
    }

    function createElement() {
        element = angular.element("<button symbol-create-modal-handle>click me</button>");
        $compile(element)($rootScope);
    }

    it('should open the modal on click', () => {
        createElement();
        spyOn($uibModal, 'open').and.callThrough();
        element[0].click();
        expect($uibModal.open).toHaveBeenCalled();
    });

    it('should close the modal', () => {
        createController();
        controller.close();
        expect(modalInstance.dismiss).toHaveBeenCalled();
    });

    it('should create a symbol and not close the modal', () => {
        createController();
        const deferred = $q.defer();
        const symbol = new Symbol(ENTITIES.symbols[0]);
        spyOn(SymbolResource, 'create').and.returnValue(deferred.promise);
        spyOn(EventBus, 'emit').and.callThrough();
        deferred.resolve(symbol);
        controller.createSymbolAndContinue();
        $rootScope.$digest();
        expect(EventBus.emit).toHaveBeenCalledWith(events.SYMBOL_CREATED, {symbol: symbol});
        expect(modalInstance.dismiss).not.toHaveBeenCalled();
    });

    it('should create a symbol and close the modal', () => {
        createController();
        const deferred = $q.defer();
        spyOn(controller, 'createSymbolAndContinue').and.returnValue(deferred.promise);
        deferred.resolve({});
        controller.createSymbol();
        $rootScope.$digest();
        expect(modalInstance.dismiss).toHaveBeenCalled();
    });

    it('should display a message if a symbol could note be created', () => {
        createController();
        const deferred = $q.defer();
        spyOn(SymbolResource, 'create').and.returnValue(deferred.promise);
        spyOn(EventBus, 'emit').and.callThrough();
        deferred.reject({data: {message: 'failed'}});
        controller.createSymbolAndContinue();
        $rootScope.$digest();
        expect(controller.error).toEqual('failed');
        expect(EventBus.emit).not.toHaveBeenCalled();
    });
});