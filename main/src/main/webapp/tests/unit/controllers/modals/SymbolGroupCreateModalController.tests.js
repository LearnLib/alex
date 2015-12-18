describe('SymbolGroupCreateModalController', () => {
    let SymbolGroupCreateModalController;
    let SessionService;
    let SymbolGroupResource;
    let $controller;
    let EventBus;
    let ToastService;
    let events;
    let scope;
    let Project;
    let SymbolGroupFormModel;

    let project;
    let modalInstance;
    let deferred;

    beforeEach(module('ALEX'));
    beforeEach(inject((_$controller_, $rootScope, _SessionService_, _Project_, _SymbolGroupResource_, _EventBus_,
                       _ToastService_, _events_, _SymbolGroupFormModel_, _$q_) => {

        SessionService = _SessionService_;
        scope = $rootScope.$new();
        SymbolGroupResource = _SymbolGroupResource_;
        $controller = _$controller_;
        EventBus = _EventBus_;
        ToastService = _ToastService_;
        events = _events_;
        Project = _Project_;
        SymbolGroupFormModel = _SymbolGroupFormModel_;

        modalInstance = {
            close: jasmine.createSpy('modalInstance.close'),
            dismiss: jasmine.createSpy('modalInstance.dismiss'),
            result: {
                then: jasmine.createSpy('modalInstance.result.then')
            }
        };

        project = new Project(ENTITIES.projects[0]);
        SessionService.saveProject(project);
        deferred = _$q_.defer();
    }));

    afterEach(() => {
        sessionStorage.removeItem('project');
    });

    function createController() {
        SymbolGroupCreateModalController = $controller('SymbolGroupCreateModalController', {
            $modalInstance: modalInstance,
            SessionService: SessionService,
            SymbolGroupResource: SymbolGroupResource,
            ToastService: ToastService,
            EventBus: EventBus
        });
    }

    it('should initialize the controller correctly', () => {
        createController();
        expect(SymbolGroupCreateModalController.project).toEqual(project);
        expect(SymbolGroupCreateModalController.group).toEqual(new SymbolGroupFormModel());
        expect(SymbolGroupCreateModalController.errorMsg).toBeNull();
    });

    it('should dismiss the modal window on close', () => {
        createController();
        SymbolGroupCreateModalController.close();
        expect(modalInstance.dismiss).toHaveBeenCalled();
    });

    it('should correctly create a new group and close the modal', () => {
        createController();
        spyOn(SymbolGroupResource, 'create').and.returnValue(deferred.promise);
        spyOn(EventBus, 'emit');
        spyOn(ToastService, 'success');

        const group = new SymbolGroupFormModel(ENTITIES.groups[0]);
        deferred.resolve(ENTITIES.groups[0]);

        SymbolGroupCreateModalController.group = group;
        SymbolGroupCreateModalController.createGroup();
        scope.$digest();

        expect(SymbolGroupResource.create).toHaveBeenCalledWith(project.id, group);
        expect(ToastService.success).toHaveBeenCalled();
        expect(EventBus.emit).toHaveBeenCalledWith(events.GROUP_CREATED, {group: ENTITIES.groups[0]});
        expect(modalInstance.dismiss).toHaveBeenCalled();
        expect(SymbolGroupCreateModalController.errorMsg).toBeNull();
    });

    it('should fail to create a new group and display an error message', () => {
        createController();
        spyOn(SymbolGroupResource, 'create').and.returnValue(deferred.promise);

        const message = 'failed';
        const group = new SymbolGroupFormModel(ENTITIES.groups[0]);
        deferred.reject({data: {message: message}});

        SymbolGroupCreateModalController.group = group;
        SymbolGroupCreateModalController.createGroup();
        scope.$digest();

        expect(SymbolGroupResource.create).toHaveBeenCalledWith(project.id, group);
        expect(SymbolGroupCreateModalController.errorMsg).toEqual(message);
    });
});