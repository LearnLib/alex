import {SymbolGroup} from '../../../../app/modules/entities/SymbolGroup';
import {events} from '../../../../app/modules/constants';
import {SymbolGroupEditModalController} from '../../../../app/modules/directives/modals/symbolGroupEditModalHandle';

describe('SymbolGroupEditModalController', () => {
    let SymbolGroupResource;
    let $controller;
    let $compile;
    let EventBus;
    let ToastService;
    let scope;
    let $uibModal;
    let $rootScope;

    let controller;
    let modalInstance;
    let deferred;
    let group;
    let element;

    beforeEach(angular.mock.module('ALEX'));
    beforeEach(angular.mock.inject((_$controller_, _SymbolGroupResource_, _EventBus_,
                       _ToastService_, _$q_, _$compile_, _$uibModal_, _$rootScope_) => {

        SymbolGroupResource = _SymbolGroupResource_;
        $controller = _$controller_;
        $rootScope = _$rootScope_;
        EventBus = _EventBus_;
        ToastService = _ToastService_;
        $compile = _$compile_;
        $uibModal = _$uibModal_;

        scope = $rootScope.$new();

        modalInstance = {
            close: jasmine.createSpy('modalInstance.close'),
            dismiss: jasmine.createSpy('modalInstance.dismiss'),
            result: {
                then: jasmine.createSpy('modalInstance.result.then')
            }
        };

        group = new SymbolGroup(ENTITIES.groups[0]);
        deferred = _$q_.defer();
    }));

    function createController() {
        controller = $controller(SymbolGroupEditModalController, {
            $uibModalInstance: modalInstance,
            modalData: {group: group},
            SymbolGroupResource: SymbolGroupResource,
            ToastService: ToastService,
            EventBus: EventBus
        });
    }

    function createElement() {
        const scope = $rootScope.$new();
        scope.group = {};
        element = angular.element("<button symbol-group-edit-modal-handle group='group'>click me</button>");
        $compile(element)(scope);
    }

    it('should open the modal on click', () => {
        createElement();
        spyOn($uibModal, 'open').and.callThrough();
        element[0].click();
        expect($uibModal.open).toHaveBeenCalled();
    });

    it('should initialize the controller correctly', () => {
        createController();
        expect(controller.group).toEqual(group);
        expect(controller.errorMsg).toBeNull();
    });

    it('should dismiss the modal window on close', () => {
        createController();
        controller.close();
        expect(modalInstance.dismiss).toHaveBeenCalled();
    });

    it('it should display an error message if deleting a group failed', () => {
        createController();
        spyOn(SymbolGroupResource, 'remove').and.returnValue(deferred.promise);

        const message = 'failed';
        deferred.reject({data: {message: message}});

        controller.deleteGroup();
        scope.$digest();

        expect(SymbolGroupResource.remove).toHaveBeenCalledWith(controller.group);
        expect(controller.errorMsg).toEqual(message);
    });

    it('should display an error message if updating a group failed', () => {
        createController();
        spyOn(SymbolGroupResource, 'update').and.returnValue(deferred.promise);

        const message = 'failed';
        deferred.reject({data: {message: message}});

        controller.updateGroup();
        scope.$digest();

        expect(SymbolGroupResource.update).toHaveBeenCalledWith(controller.group);
        expect(controller.errorMsg).toEqual(message);
    });

    it('should correctly update a group', () => {
        createController();
        spyOn(SymbolGroupResource, 'update').and.returnValue(deferred.promise);
        spyOn(ToastService, 'success').and.callThrough();
        spyOn(EventBus, 'emit').and.callThrough();

        deferred.resolve(controller.group);

        controller.updateGroup();
        scope.$digest();

        expect(SymbolGroupResource.update).toHaveBeenCalledWith(controller.group);
        expect(EventBus.emit).toHaveBeenCalledWith(events.GROUP_UPDATED, {group: controller.group});
        expect(ToastService.success).toHaveBeenCalled();
        expect(modalInstance.dismiss).toHaveBeenCalled();
        expect(controller.errorMsg).toBeNull();
    });

    it('should correctly delete a group', () => {
        createController();
        spyOn(SymbolGroupResource, 'remove').and.returnValue(deferred.promise);
        spyOn(ToastService, 'success').and.callThrough();
        spyOn(EventBus, 'emit').and.callThrough();

        deferred.resolve({});

        controller.deleteGroup();
        scope.$digest();

        expect(SymbolGroupResource.remove).toHaveBeenCalledWith(controller.group);
        expect(EventBus.emit).toHaveBeenCalledWith(events.GROUP_DELETED, {group: controller.group});
        expect(ToastService.success).toHaveBeenCalled();
        expect(modalInstance.dismiss).toHaveBeenCalled();
        expect(controller.errorMsg).toBeNull();
    });
});