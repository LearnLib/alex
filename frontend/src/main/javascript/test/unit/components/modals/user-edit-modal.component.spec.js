import {User} from '../../../../src/js/entities/user';
import {UserEditModalComponent} from '../../../../src/js/components/modals/user-edit-modal/user-edit-modal.component';
import {events} from '../../../../src/js/constants';

describe('userEditModal', () => {
    let $rootScope, $controller, $q, $compile, $uibModal, $state, UserResource, ToastService, PromptService, EventBus, SessionService;
    let controller, modalInstance;

    beforeEach(angular.mock.module('ALEX'));
    beforeEach(angular.mock.inject(($injector) => {
        $rootScope = $injector.get('$rootScope');
        $controller = $injector.get('$controller');
        $q = $injector.get('$q');
        $compile = $injector.get('$compile');
        $uibModal = $injector.get('$uibModal');
        $state = $injector.get('$state');
        UserResource = $injector.get('UserResource');
        ToastService = $injector.get('ToastService');
        PromptService = $injector.get('PromptService');
        EventBus = $injector.get('EventBus');
        SessionService = $injector.get('SessionService');

        modalInstance = {
            close: jasmine.createSpy('modalInstance.close'),
            dismiss: jasmine.createSpy('modalInstance.dismiss'),
            result: {
                then: jasmine.createSpy('modalInstance.result.then')
            }
        };
    }));
    afterEach(() => {
        document.body.innerHTML = '';
    });

    function createController() {
        const user = new User(ENTITIES.users[0]);

        controller = $controller(UserEditModalComponent, {
            $uibModalInstance: modalInstance,
            modalData: {user: user},
            UserResource: UserResource,
            ToastService: ToastService,
            PromptService: PromptService,
            EventBus: EventBus,
            SessionService: SessionService
        });

        $uibModal.open({
            templateUrl: 'html/directives/modals/user-edit-modal.html',
            controller: () => controller,
            controllerAs: 'vm',
            resolve: {
                modalData: function () {
                    return {user: user};
                }
            }
        });

        $rootScope.$digest();
    }

    it('should open the modal on click', () => {
        spyOn($uibModal, 'open').and.callThrough();

        const scope = $rootScope.$new();
        scope.user = new User(ENTITIES.users[0]);
        const element = angular.element("<button user-edit-modal-handle user='user'>Click me!</button>");
        $compile(element)(scope);

        element[0].click();
        expect($uibModal.open).toHaveBeenCalled();
    });

    it('should change the email of a user', () => {
        createController();
    });

    it('should display a message if the email could not be changed', () => {
        createController();
    });

    it('should promote a user', () => {
        createController();

        const deferred = $q.defer();
        spyOn(UserResource, 'promote').and.returnValue(deferred.promise);
        spyOn(EventBus, 'emit').and.callThrough();
        deferred.resolve({});

        controller.promoteUser();
        $rootScope.$digest();

        expect(UserResource.promote).toHaveBeenCalledWith(controller.user);
        expect(EventBus.emit).toHaveBeenCalled();
        expect(modalInstance.dismiss).toHaveBeenCalled();
    });

    it('should display a message if promoting a user failed', () => {
        createController();

        const deferred = $q.defer();
        spyOn(UserResource, 'promote').and.returnValue(deferred.promise);
        spyOn(EventBus, 'emit').and.callThrough();
        deferred.reject({data: {message: 'failed'}});

        controller.promoteUser();
        $rootScope.$digest();

        expect(UserResource.promote).toHaveBeenCalledWith(controller.user);
        expect(controller.error).toEqual('failed');
        expect(EventBus.emit).not.toHaveBeenCalled();
    });

    it('should delete a user after the user confirmed the action', () => {
        createController();

        const d1 = $q.defer();
        const d2 = $q.defer();
        spyOn(UserResource, 'remove').and.returnValue(d1.promise);
        spyOn(PromptService, 'confirm').and.returnValue(d2.promise);
        spyOn(EventBus, 'emit').and.callThrough();
        d1.resolve({});
        d2.resolve({});

        controller.deleteUser();
        $rootScope.$digest();

        expect(PromptService.confirm).toHaveBeenCalled();
        expect(UserResource.remove).toHaveBeenCalledWith(controller.user);
        expect(EventBus.emit).toHaveBeenCalledWith(events.USER_DELETED, {user: controller.user});
        expect(modalInstance.dismiss).toHaveBeenCalled();
    });

    it('should not delete a user if the user denied the action', () => {
        createController();

        const d1 = $q.defer();
        const d2 = $q.defer();
        spyOn(UserResource, 'remove').and.returnValue(d1.promise);
        spyOn(PromptService, 'confirm').and.returnValue(d2.promise);
        d2.reject({});

        controller.deleteUser();
        $rootScope.$digest();

        expect(PromptService.confirm).toHaveBeenCalled();
        expect(UserResource.remove).not.toHaveBeenCalled();
        expect(controller.error).toBeNull();
    });

    it('should display a message if the user could not be deleted', () => {
        createController();

        const d1 = $q.defer();
        const d2 = $q.defer();
        spyOn(UserResource, 'remove').and.returnValue(d1.promise);
        spyOn(PromptService, 'confirm').and.returnValue(d2.promise);
        d1.reject({data: {message: 'failed'}});
        d2.resolve({});

        controller.deleteUser();
        $rootScope.$digest();

        expect(PromptService.confirm).toHaveBeenCalled();
        expect(UserResource.remove).toHaveBeenCalledWith(controller.user);
        expect(controller.error).toEqual('failed');
    });

    it('should close the modal', () => {
        createController();
        controller.close();
        expect(modalInstance.dismiss).toHaveBeenCalled();
    });
});
