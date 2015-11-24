describe('SymbolGroupEditModalController', () => {
    let SymbolGroupEditModalController;
    let SymbolGroupResource;
    let $controller;
    let EventBus;
    let ToastService;
    let events;
    let scope;
    let SymbolGroup;

    let modalInstance;
    let deferred;
    let group;

    beforeEach(module('ALEX'));
    beforeEach(inject((_$controller_, $rootScope, _SymbolGroupResource_, _EventBus_,
                       _ToastService_, _events_, _$q_, _SymbolGroup_) => {

        scope = $rootScope.$new();
        SymbolGroupResource = _SymbolGroupResource_;
        $controller = _$controller_;
        EventBus = _EventBus_;
        ToastService = _ToastService_;
        events = _events_;
        SymbolGroup = _SymbolGroup_;

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
        SymbolGroupEditModalController = $controller('SymbolGroupEditModalController', {
            $modalInstance: modalInstance,
            modalData: {group: group},
            SymbolGroupResource: SymbolGroupResource,
            ToastService: ToastService,
            EventBus: EventBus
        });
    }

    it('should initialize the controller correctly', () => {
        createController();
        expect(SymbolGroupEditModalController.group).toEqual(group);
        expect(SymbolGroupEditModalController.errorMsg).toBeNull();
    });

    it('should dismiss the modal window on close', () => {
        createController();
        SymbolGroupEditModalController.close();
        expect(modalInstance.dismiss).toHaveBeenCalled();
    });

    it('it should display an error message if deleting a group failed', () => {
        createController();
        spyOn(SymbolGroupResource, 'remove').and.returnValue(deferred.promise);

        const message = 'failed';
        deferred.reject({data: {message: message}});

        SymbolGroupEditModalController.deleteGroup();
        scope.$digest();

        expect(SymbolGroupResource.remove).toHaveBeenCalledWith(SymbolGroupEditModalController.group);
        expect(SymbolGroupEditModalController.errorMsg).toEqual(message);
    });

    it('should display an error message if updating a group failed', () => {
        createController();
        spyOn(SymbolGroupResource, 'update').and.returnValue(deferred.promise);

        const message = 'failed';
        deferred.reject({data: {message: message}});

        SymbolGroupEditModalController.updateGroup();
        scope.$digest();

        expect(SymbolGroupResource.update).toHaveBeenCalledWith(SymbolGroupEditModalController.group);
        expect(SymbolGroupEditModalController.errorMsg).toEqual(message);
    });

    it('should correctly update a group', () => {
        createController();
        spyOn(SymbolGroupResource, 'update').and.returnValue(deferred.promise);
        spyOn(ToastService, 'success').and.callThrough();
        spyOn(EventBus, 'emit').and.callThrough();

        deferred.resolve(SymbolGroupEditModalController.group);

        SymbolGroupEditModalController.updateGroup();
        scope.$digest();

        expect(SymbolGroupResource.update).toHaveBeenCalledWith(SymbolGroupEditModalController.group);
        expect(EventBus.emit).toHaveBeenCalledWith(events.GROUP_UPDATED, {group: SymbolGroupEditModalController.group});
        expect(ToastService.success).toHaveBeenCalled();
        expect(modalInstance.dismiss).toHaveBeenCalled();
        expect(SymbolGroupEditModalController.errorMsg).toBeNull();
    });

    it('should correctly delete a group', () => {
        createController();
        spyOn(SymbolGroupResource, 'remove').and.returnValue(deferred.promise);
        spyOn(ToastService, 'success').and.callThrough();
        spyOn(EventBus, 'emit').and.callThrough();

        deferred.resolve({});

        SymbolGroupEditModalController.deleteGroup();
        scope.$digest();

        expect(SymbolGroupResource.remove).toHaveBeenCalledWith(SymbolGroupEditModalController.group);
        expect(EventBus.emit).toHaveBeenCalledWith(events.GROUP_DELETED, {group: SymbolGroupEditModalController.group});
        expect(ToastService.success).toHaveBeenCalled();
        expect(modalInstance.dismiss).toHaveBeenCalled();
        expect(SymbolGroupEditModalController.errorMsg).toBeNull();
    });
});