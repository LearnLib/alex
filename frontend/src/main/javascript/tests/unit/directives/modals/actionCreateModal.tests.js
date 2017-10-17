import {Project} from '../../../../src/js/entities/Project';
import {actionType} from '../../../../src/js/constants';
import {ActionCreateModalController} from '../../.././actionCreateModalHandle';

describe('ActionCreateModalController', () => {
    let $controller, $rootScope, $q;
    let SessionService, $compile, ActionService, SymbolResource, $uibModal, EventBus;
    let project, element;
    let modalInstance;
    let controller;

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

        SessionService.saveProject(project);
    }));

    afterEach(() => {
        SessionService.removeProject();
    });

    function createController() {
        controller = $controller(ActionCreateModalController, {
            $uibModalInstance: modalInstance,
            ActionService: ActionService,
            SymbolResource: SymbolResource,
            SessionService: SessionService,
            EventBus: EventBus
        });
    }

    function createElement() {
        element = angular.element("<button action-create-modal-handle>click me</button>");
        $compile(element)($rootScope);
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

        expect(controller.action).toBeNull();
        expect(controller.symbols).toEqual([]);

        $rootScope.$digest();

        expect(SymbolResource.getAll).toHaveBeenCalledWith(project.id);
        expect(controller.symbols).toEqual(ENTITIES.symbols);
    });

    it('should create a new action model on select', () => {
        init();
        $rootScope.$digest();

        spyOn(ActionService, 'createFromType').and.callThrough();
        const type = actionType.WEB_CHECK_NODE;
        controller.selectNewActionType(type);
        expect(ActionService.createFromType).toHaveBeenCalledWith(type);
        expect(controller.action).not.toBeNull();
    });

    it('should create a new action and close the modal window', () => {
        init();
        $rootScope.$digest();

        spyOn(EventBus, 'emit').and.callThrough();

        controller.createAction();

        expect(modalInstance.dismiss).toHaveBeenCalled();
        expect(EventBus.emit).toHaveBeenCalled()
    });

    it('should create a new action and stay open', () => {
        init();
        $rootScope.$digest();

        spyOn(EventBus, 'emit').and.callThrough();

        controller.createActionAndContinue();

        expect(modalInstance.dismiss).not.toHaveBeenCalled();
        expect(controller.action).toBeNull();
        expect(EventBus.emit).toHaveBeenCalled()
    });

    it('should close the modal window', () => {
        init();
        $rootScope.$digest();

        controller.closeModal();
        expect(modalInstance.dismiss).toHaveBeenCalled();
    })
});