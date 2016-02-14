import {User} from '../../../../app/modules/entities/User';
import {UserEditModalController} from '../../../../app/modules/directives/modals/userEditModalHandle';

describe('userEditModal', () => {
    let $rootScope, $controller, $compile, $uibModal, $state, UserResource, ToastService, PromptService, EventBus, SessionService;
    let controller, modalInstance;

    beforeEach(angular.mock.module('ALEX'));
    beforeEach(angular.mock.inject(($injector) => {
        $rootScope = $injector.get('$rootScope');
        $controller = $injector.get('$controller');
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

        controller = $controller(UserEditModalController, {
            $uibModalInstance: modalInstance,
            modalData: {user: user},
            UserResource: UserResource,
            ToastService: ToastService,
            PromptService: PromptService,
            EventBus: EventBus,
            SessionService: SessionService
        });

        $uibModal.open({
            templateUrl: 'views/modals/user-edit-modal.html',
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
    });

    it('should display a message if promoting a user failed', () => {
        createController();
    });

    it('should delete a user after the user confirmed the action', () => {
        createController();
    });

    it('should not delete a user if the user denied the action', () => {
        createController();
    });

    it('should display a message if the user could not be deleted', () => {
        createController();
    });

    it('should close the modal', () => {
        createController();
        controller.close();
        expect(modalInstance.dismiss).toHaveBeenCalled();
    });
});