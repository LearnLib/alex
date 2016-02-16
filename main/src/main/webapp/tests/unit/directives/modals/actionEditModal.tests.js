import {Project} from '../../../../app/modules/entities/Project';
import {actionType, events} from '../../../../app/modules/constants';
import {ActionEditModalController} from '../../../../app/modules/directives/modals/actionEditModalHandle';

describe('ActionEditModalController', () => {
    let $controller, $rootScope, $q, $compile, $uibModal;
    let SessionService, ActionService, SymbolResource, EventBus;
    let project, modalData, modalInstance, controller, element;

    beforeEach(angular.mock.module('ALEX'));
    beforeEach(angular.mock.inject(($injector) => {
        $controller = $injector.get('$controller');
        $rootScope = $injector.get('$rootScope');
        $q = $injector.get('$q');
        $compile = $injector.get('$compile');
        $uibModal = $injector.get('$uibModal');

        SessionService = $injector.get('SessionService');
        ActionService = $injector.get('ActionService');
        SymbolResource = $injector.get('SymbolResource');
        EventBus = $injector.get('EventBus');

        project = new Project(ENTITIES.projects[0]);

        modalInstance = {
            close: jasmine.createSpy('modalInstance.close'),
            dismiss: jasmine.createSpy('modalInstance.dismiss'),
            result: {
                then: jasmine.createSpy('modalInstance.result.then')
            }
        };

        modalData = {
            action: {}
        };

        SessionService.saveProject(project);
    }));

    afterEach(() => {
        SessionService.removeProject();
    });

    function createController() {
        controller = $controller(ActionEditModalController, {
            $uibModalInstance: modalInstance,
            modalData: modalData,
            ActionService: ActionService,
            SymbolResource: SymbolResource,
            SessionService: SessionService,
            EventBus: EventBus
        });
    }

    function createElement() {
        const scope = $rootScope.$new();
        scope.action = {
            type: 'web_click',
            _id: 0
        };
        element = angular.element("<button action-edit-modal-handle action='action'>click me</button>");
        $compile(element)(scope);
    }

    function init() {
        const deferred = $q.defer();
        spyOn(SymbolResource, 'getAll').and.returnValue(deferred.promise);
        deferred.resolve(ENTITIES.symbols);
        createController();
    }

    it('should open the modal on click', () => {
        createElement();
        spyOn($uibModal, 'open').and.callThrough();
        element[0].click();
        expect($uibModal.open).toHaveBeenCalled();
    });

    it('should correctly instantiate the controller', () => {
        init();

        expect(controller.action).toEqual(modalData.action);
        expect(controller.symbols).toEqual([]);

        $rootScope.$digest();

        expect(SymbolResource.getAll).toHaveBeenCalledWith(project.id);
        expect(controller.symbols).toEqual(ENTITIES.symbols);
    });

    it('should update an action and close the modal window', () => {
        init();
        $rootScope.$digest();

        spyOn(EventBus, 'emit').and.callThrough();

        controller.updateAction();

        expect(modalInstance.dismiss).toHaveBeenCalled();
        expect(EventBus.emit).toHaveBeenCalled()
    });

    it('should close the modal window', () => {
        init();
        $rootScope.$digest();

        controller.closeModal();
        expect(modalInstance.dismiss).toHaveBeenCalled();
    })
});