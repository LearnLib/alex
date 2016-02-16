import {SymbolEditModalController} from '../../../../app/modules/directives/modals/symbolEditModalHandle';
import {Symbol} from '../../../../app/modules/entities/Symbol';

describe('symbolEditModal', () => {
    let $controller, $compile, $q, $rootScope, SymbolResource, ToastService, EventBus, $uibModal;
    let controller, modalInstance, element, data;

    beforeEach(angular.mock.module('ALEX'));
    beforeEach(angular.mock.inject(($injector) => {
        $controller = $injector.get('$controller');
        $compile = $injector.get('$compile');
        $q = $injector.get('$q');
        $rootScope = $injector.get('$rootScope');
        SymbolResource = $injector.get('SymbolResource');
        ToastService = $injector.get('ToastService');
        EventBus = $injector.get('EventBus');
        $uibModal = $injector.get('$uibModal');

        modalInstance = {
            close: jasmine.createSpy('modalInstance.close'),
            dismiss: jasmine.createSpy('modalInstance.dismiss'),
            result: {
                then: jasmine.createSpy('modalInstance.result.then')
            }
        };

        data = {
            symbol: new Symbol(ENTITIES.symbols[0]),
            updateOnServer: true
        };
    }));
    afterEach(() => {
        document.body.innerHTML = '';
    });

    function createController() {
        controller = $controller(SymbolEditModalController, {
            $uibModalInstance: modalInstance,
            modalData: data,
            SymbolResource: SymbolResource,
            ToastService: ToastService,
            EventBus: EventBus
        });

        $uibModal.open({
            templateUrl: 'views/modals/symbol-edit-modal.html',
            controller: () => controller,
            controllerAs: 'vm',
            resolve: {
                modalData: function () {
                    return data;
                }
            }
        });

        $rootScope.$digest();
    }

    function createElement() {
        const scope = $rootScope.$new();
        angular.extend(scope, data);

        element = angular.element("" +
            "<button symbol-edit-modal-handle symbol='symbol' update-on-server='updateOnServer'>click me</button>" +
            "");
        $compile(element)(scope);
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

    it('should emit an updated symbol without calling the api', () => {
        data.updateOnServer = false;
        createController();
        spyOn(EventBus, 'emit').and.callThrough();
        spyOn(SymbolResource, 'update').and.callThrough();

        controller.updateSymbol();
        $rootScope.$digest();

        expect(SymbolResource.update).not.toHaveBeenCalled();
        expect(EventBus.emit).toHaveBeenCalled();
        expect(modalInstance.dismiss).toHaveBeenCalled();
    });

    it('should update a symbol', () => {
        data.updateOnServer = true;
        const deferred = $q.defer();
        spyOn(SymbolResource, 'update').and.returnValue(deferred.promise);
        spyOn(EventBus, 'emit').and.callThrough();
        deferred.resolve({});

        createController();
        controller.updateSymbol();
        $rootScope.$digest();

        expect(SymbolResource.update).toHaveBeenCalledWith(controller.symbol);
        expect(EventBus.emit).toHaveBeenCalled();
    });

    it('should fail to update a symbol and display an error message', () => {
        data.updateOnServer = true;
        const deferred = $q.defer();
        spyOn(SymbolResource, 'update').and.returnValue(deferred.promise);
        spyOn(EventBus, 'emit').and.callThrough();
        deferred.reject({data: {message: 'failed'}});

        createController();
        controller.updateSymbol();
        $rootScope.$digest();

        expect(SymbolResource.update).toHaveBeenCalledWith(controller.symbol);
        expect(controller.errorMsg).toEqual('failed');
        expect(EventBus.emit).not.toHaveBeenCalled();
    });
});