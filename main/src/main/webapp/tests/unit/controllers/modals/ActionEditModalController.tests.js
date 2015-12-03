describe('ActionEditModalController', () => {
    let $controller, $rootScope, $q;
    let SessionService, Project, ActionEditModalController, ActionService, SymbolResource, EventBus, events,
        actionType;
    let project, modalData, modalInstance;

    beforeEach(module('ALEX'));
    beforeEach(inject(($injector) => {
        $controller = $injector.get('$controller');
        $rootScope = $injector.get('$rootScope');
        $q = $injector.get('$q');

        SessionService = $injector.get('SessionService');
        Project = $injector.get('Project');
        ActionService = $injector.get('ActionService');
        SymbolResource = $injector.get('SymbolResource');
        EventBus = $injector.get('EventBus');
        events = $injector.get('events');

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

        SessionService.project.save(project);
    }));

    afterEach(() => {
        SessionService.project.remove();
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