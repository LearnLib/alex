import {Project} from '../../../../app/modules/entities/Project';
import {actionType, events} from '../../../../app/modules/constants';

describe('ActionEditModalController', () => {
    let $controller, $rootScope, $q;
    let SessionService, ActionEditModalController, ActionService, SymbolResource, EventBus;
    let project, modalData, modalInstance;

    beforeEach(angular.mock.module('ALEX'));
    beforeEach(angular.mock.inject(($injector) => {
        $controller = $injector.get('$controller');
        $rootScope = $injector.get('$rootScope');
        $q = $injector.get('$q');

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
        ActionEditModalController = $controller('ActionEditModalController', {
            $modalInstance: modalInstance,
            modalData: modalData,
            ActionService: ActionService,
            SymbolResource: SymbolResource,
            SessionService: SessionService,
            EventBus: EventBus
        });
    }

    function init() {
        const deferred = $q.defer();
        spyOn(SymbolResource, 'getAll').and.returnValue(deferred.promise);
        deferred.resolve(ENTITIES.symbols);
        createController();
    }

    it('should correctly instantiate the controller', () => {
        init();

        expect(ActionEditModalController.action).toEqual(modalData.action);
        expect(ActionEditModalController.symbols).toEqual([]);

        $rootScope.$digest();

        expect(SymbolResource.getAll).toHaveBeenCalledWith(project.id);
        expect(ActionEditModalController.symbols).toEqual(ENTITIES.symbols);
    });

    it('should update an action and close the modal window', () => {
        init();
        $rootScope.$digest();

        spyOn(EventBus, 'emit').and.callThrough();

        ActionEditModalController.updateAction();

        expect(modalInstance.dismiss).toHaveBeenCalled();
        expect(EventBus.emit).toHaveBeenCalled()
    });

    it('should close the modal window', () => {
        init();
        $rootScope.$digest();

        ActionEditModalController.closeModal();
        expect(modalInstance.dismiss).toHaveBeenCalled();
    })
});