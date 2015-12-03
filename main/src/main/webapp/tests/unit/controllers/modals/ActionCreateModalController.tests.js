describe('ActionCreateModalController', () => {
    let $controller, $rootScope, $q;
    let SessionService, Project, ActionCreateModalController, ActionService, SymbolResource, EventBus, events,
        actionType;
    let project;
    let modalInstance;

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
        actionType = $injector.get('actionType');

        project = new Project(ENTITIES.projects[0]);

        modalInstance = {
            close: jasmine.createSpy('modalInstance.close'),
            dismiss: jasmine.createSpy('modalInstance.dismiss'),
            result: {
                then: jasmine.createSpy('modalInstance.result.then')
            }
        };

        SessionService.project.save(project);
    }));

    afterEach(() => {
        SessionService.project.remove();
    });

    function createController() {
        ActionCreateModalController = $controller('ActionCreateModalController', {
            $modalInstance: modalInstance,
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

        expect(ActionCreateModalController.action).toBeNull();
        expect(ActionCreateModalController.symbols).toEqual([]);

        $rootScope.$digest();

        expect(SymbolResource.getAll).toHaveBeenCalledWith(project.id);
        expect(ActionCreateModalController.symbols).toEqual(ENTITIES.symbols);
    });

    it('should create a new action model on select', () => {
        init();
        $rootScope.$digest();

        spyOn(ActionService, 'createFromType').and.callThrough();
        const type = actionType.WEB_CHECK_NODE;
        ActionCreateModalController.selectNewActionType(type);
        expect(ActionService.createFromType).toHaveBeenCalledWith(type);
        expect(ActionCreateModalController.action).not.toBeNull();
    });

    it('should create a new action and close the modal window', () => {
        init();
        $rootScope.$digest();

        spyOn(EventBus, 'emit').and.callThrough();

        ActionCreateModalController.createAction();

        expect(modalInstance.dismiss).toHaveBeenCalled();
        expect(EventBus.emit).toHaveBeenCalled()
    });

    it('should create a new action and stay open', () => {
        init();
        $rootScope.$digest();

        spyOn(EventBus, 'emit').and.callThrough();

        ActionCreateModalController.createActionAndContinue();

        expect(modalInstance.dismiss).not.toHaveBeenCalled();
        expect(ActionCreateModalController.action).toBeNull();
        expect(EventBus.emit).toHaveBeenCalled()
    });

    it('should close the modal window', () => {
        init();
        $rootScope.$digest();

        ActionCreateModalController.closeModal();
        expect(modalInstance.dismiss).toHaveBeenCalled();
    })
});