import {Project} from '../../../../app/modules/entities/Project';
import {events} from '../../../../app/modules/constants';
import {ProjectSettingsModalController} from '../../../../app/modules/directives/modals/projectSettingsModalHandle';


describe('ProjectSettingsModalController', () => {
    let ProjectResource, LearnerResource, $controller, EventBus, ToastService, scope, $uibModal, $compile, $q;

    let controller, project, modalInstance, deferred, element;

    beforeEach(angular.mock.module('ALEX'));
    beforeEach(angular.mock.inject(($injector) => {

        scope = $injector.get('$rootScope').$new();
        ProjectResource = $injector.get('ProjectResource');
        LearnerResource = $injector.get('LearnerResource');
        $controller = $injector.get('$controller');
        EventBus = $injector.get('EventBus');
        ToastService = $injector.get('ToastService');
        $uibModal = $injector.get('$uibModal');
        $compile = $injector.get('$compile');
        $q = $injector.get('$q');

        modalInstance = {
            close: jasmine.createSpy('modalInstance.close'),
            dismiss: jasmine.createSpy('modalInstance.dismiss'),
            result: {
                then: jasmine.createSpy('modalInstance.result.then')
            }
        };

        project = new Project(ENTITIES.projects[0]);
        deferred = $q.defer();
    }));

    afterEach(() => {
        sessionStorage.removeItem('project');
        document.body.innerHTML = "";
    });

    function createController() {
        controller = $controller(ProjectSettingsModalController, {
            $uibModalInstance: modalInstance,
            modalData: {project: project},
            ProjectResource: ProjectResource,
            ToastService: ToastService,
            EventBus: EventBus
        });

        $uibModal.open({
            templateUrl: 'views/modals/project-settings-modal.html',
            controller: () => controller,
            controllerAs: 'vm',
            resolve: {
                modalData: function () {
                    return {project: new Project(project)};
                }
            }
        });

        scope.$digest();
    }

    function createElement() {
        element = angular.element("<button project-settings-modal-handle project='project'>asd</button>");
        scope.project = project;
        $compile(element)(scope);
    }

    it('should initialize the controller correctly', () => {
        createController();
        expect(controller.project).toEqual(project);
        expect(controller.error).toBeNull();
    });

    it('should dismiss the modal window on close', () => {
        createController();
        controller.close();
        expect(modalInstance.dismiss).toHaveBeenCalled();
    });

    it('should correctly update the project and close the modal', () => {
        createController();
        spyOn(ProjectResource, 'update').and.returnValue(deferred.promise);
        spyOn(EventBus, 'emit');
        spyOn(ToastService, 'success');

        deferred.resolve(project);

        controller.updateProject();
        scope.$digest();

        expect(ProjectResource.update).toHaveBeenCalledWith(controller.project);
        expect(ToastService.success).toHaveBeenCalled();
        expect(EventBus.emit).toHaveBeenCalledWith(events.PROJECT_UPDATED, {project: controller.project});
        expect(modalInstance.dismiss).toHaveBeenCalled();
        expect(controller.error).toBeNull();
    });

    it('should fail to update the project and display an error message', () => {
        createController();
        spyOn(ProjectResource, 'update').and.returnValue(deferred.promise);

        const message = 'failed';
        deferred.reject({data: {message: message}});

        controller.updateProject();
        scope.$digest();

        expect(ProjectResource.update).toHaveBeenCalledWith(controller.project);
        expect(controller.error).toEqual(message);
    });

    it('should open the modal on click', () => {
        spyOn($uibModal, 'open').and.callThrough();

        const deferred = $q.defer();
        spyOn(LearnerResource, 'isActive').and.returnValue(deferred.promise);
        deferred.resolve({active: false});

        createElement();
        element[0].click();
        scope.$digest();

        expect(LearnerResource.isActive).toHaveBeenCalled();
        expect($uibModal.open).toHaveBeenCalled();
    });

    it('should not open the modal if the learner is active', () => {
        spyOn($uibModal, 'open').and.callThrough();

        const deferred = $q.defer();
        spyOn(LearnerResource, 'isActive').and.returnValue(deferred.promise);
        deferred.resolve({active: true, project: project.id});

        createElement();
        element[0].click();
        scope.$digest();

        expect(LearnerResource.isActive).toHaveBeenCalled();
        expect($uibModal.open).not.toHaveBeenCalled();
    })
});