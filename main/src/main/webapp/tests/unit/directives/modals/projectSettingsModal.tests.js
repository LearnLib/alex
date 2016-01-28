import {Project} from '../../../../app/modules/entities/Project';
import {events} from '../../../../app/modules/constants';
import {ProjectSettingsModalController} from '../../../../app/modules/directives/modals/projectSettingsModalHandle';


describe('ProjectSettingsModalController', () => {
    let ProjectResource;
    let $controller;
    let EventBus;
    let ToastService;
    let scope;

    let controller;
    let project;
    let modalInstance;
    let deferred;

    beforeEach(angular.mock.module('ALEX'));
    beforeEach(angular.mock.inject((_$controller_, $rootScope, _ProjectResource_, _EventBus_,
                       _ToastService_, _$q_) => {

        scope = $rootScope.$new();
        ProjectResource = _ProjectResource_;
        $controller = _$controller_;
        EventBus = _EventBus_;
        ToastService = _ToastService_;

        modalInstance = {
            close: jasmine.createSpy('modalInstance.close'),
            dismiss: jasmine.createSpy('modalInstance.dismiss'),
            result: {
                then: jasmine.createSpy('modalInstance.result.then')
            }
        };

        project = new Project(ENTITIES.projects[0]);
        deferred = _$q_.defer();
    }));

    afterEach(() => {
        sessionStorage.removeItem('project');
    });

    function createController() {
        controller = $controller(ProjectSettingsModalController, {
            $modalInstance: modalInstance,
            modalData: {project: project},
            ProjectResource: ProjectResource,
            ToastService: ToastService,
            EventBus: EventBus
        });
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
});