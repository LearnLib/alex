import {Project} from '../../../../src/js/entities/Project';
import {SymbolGroupFormModel} from '../../../../src/js/entities/SymbolGroup';
import {events} from '../../../../src/js/constants';
import {SymbolGroupCreateModalController} from '../../../../src/js/directives/modals/symbolGroupCreateModalHandle';

describe('SymbolGroupCreateModalController', () => {
    let SessionService, SymbolGroupResource, $compile, $uibModal, $q, $controller, EventBus, ToastService, $rootScope;

    let controller, project, modalInstance, deferred, element, scope;

    beforeEach(angular.mock.module('ALEX'));
    beforeEach(angular.mock.inject(($injector) => {

        SessionService = $injector.get('SessionService');
        $rootScope = $injector.get('$rootScope');
        SymbolGroupResource = $injector.get('SymbolGroupResource');
        $controller = $injector.get('$controller');
        $compile = $injector.get('$compile');
        $q = $injector.get('$q');
        EventBus = $injector.get('EventBus');
        ToastService = $injector.get('ToastService');
        $uibModal = $injector.get('$uibModal');

        scope = $rootScope.$new();
        modalInstance = {
            close: jasmine.createSpy('modalInstance.close'),
            dismiss: jasmine.createSpy('modalInstance.dismiss'),
            result: {
                then: jasmine.createSpy('modalInstance.result.then')
            }
        };

        project = new Project(ENTITIES.projects[0]);
        SessionService.saveProject(project);
        deferred = $q.defer();
    }));

    afterEach(() => {
        sessionStorage.removeItem('project');
    });

    function createController() {
        controller = $controller(SymbolGroupCreateModalController, {
            $uibModalInstance: modalInstance,
            SessionService: SessionService,
            SymbolGroupResource: SymbolGroupResource,
            ToastService: ToastService,
            EventBus: EventBus
        });
    }

    function createElement() {
        element = angular.element("<button symbol-group-create-modal-handle>click me</button>");
        $compile(element)($rootScope);
    }

    it('should open the modal on click', () => {
        createElement();
        spyOn($uibModal, 'open').and.callThrough();
        element[0].click();
        expect($uibModal.open).toHaveBeenCalled();
    });

    it('should initialize the controller correctly', () => {
        createController();
        expect(controller.project).toEqual(project);
        expect(controller.group).toEqual(new SymbolGroupFormModel());
        expect(controller.errorMsg).toBeNull();
    });

    it('should dismiss the modal window on close', () => {
        createController();
        controller.close();
        expect(modalInstance.dismiss).toHaveBeenCalled();
    });

    it('should correctly create a new group and close the modal', () => {
        createController();
        spyOn(SymbolGroupResource, 'create').and.returnValue(deferred.promise);
        spyOn(EventBus, 'emit');
        spyOn(ToastService, 'success');

        const group = new SymbolGroupFormModel(ENTITIES.groups[0]);
        deferred.resolve(ENTITIES.groups[0]);

        controller.group = group;
        controller.createGroup();
        scope.$digest();

        expect(SymbolGroupResource.create).toHaveBeenCalledWith(project.id, group);
        expect(ToastService.success).toHaveBeenCalled();
        expect(EventBus.emit).toHaveBeenCalledWith(events.GROUP_CREATED, {group: ENTITIES.groups[0]});
        expect(modalInstance.dismiss).toHaveBeenCalled();
        expect(controller.errorMsg).toBeNull();
    });

    it('should fail to create a new group and display an error message', () => {
        createController();
        spyOn(SymbolGroupResource, 'create').and.returnValue(deferred.promise);

        const message = 'failed';
        const group = new SymbolGroupFormModel(ENTITIES.groups[0]);
        deferred.reject({data: {message: message}});

        controller.group = group;
        controller.createGroup();
        scope.$digest();

        expect(SymbolGroupResource.create).toHaveBeenCalledWith(project.id, group);
        expect(controller.errorMsg).toEqual(message);
    });
});