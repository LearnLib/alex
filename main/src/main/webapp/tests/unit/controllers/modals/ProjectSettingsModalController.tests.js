import {Project} from '../../../../app/modules/entities/Project';
import {events} from '../../../../app/modules/constants';

describe('ProjectSettingsModalController', () => {
    let ProjectSettingsModalController;
    let ProjectResource;
    let $controller;
    let EventBus;
    let ToastService;
    let scope;

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
        ProjectSettingsModalController = $controller('ProjectSettingsModalController', {
            $modalInstance: modalInstance,
            modalData: {project: project},
            ProjectResource: ProjectResource,
            ToastService: ToastService,
            EventBus: EventBus
        });
    }

    it('should initialize the controller correctly', () => {
        createController();
        expect(ProjectSettingsModalController.project).toEqual(project);
        expect(ProjectSettingsModalController.error).toBeNull();
    });

    it('should dismiss the modal window on close', () => {
        createController();
        ProjectSettingsModalController.close();
        expect(modalInstance.dismiss).toHaveBeenCalled();
    });

    it('should correctly update the project and close the modal', () => {
        createController();
        spyOn(ProjectResource, 'update').and.returnValue(deferred.promise);
        spyOn(EventBus, 'emit');
        spyOn(ToastService, 'success');

        deferred.resolve(project);

        ProjectSettingsModalController.updateProject();
        scope.$digest();

        expect(ProjectResource.update).toHaveBeenCalledWith(ProjectSettingsModalController.project);
        expect(ToastService.success).toHaveBeenCalled();
        expect(EventBus.emit).toHaveBeenCalledWith(events.PROJECT_UPDATED, {project: ProjectSettingsModalController.project});
        expect(modalInstance.dismiss).toHaveBeenCalled();
        expect(ProjectSettingsModalController.error).toBeNull();
    });

    it('should fail to update the project and display an error message', () => {
        createController();
        spyOn(ProjectResource, 'update').and.returnValue(deferred.promise);

        const message = 'failed';
        deferred.reject({data: {message: message}});

        ProjectSettingsModalController.updateProject();
        scope.$digest();

        expect(ProjectResource.update).toHaveBeenCalledWith(ProjectSettingsModalController.project);
        expect(ProjectSettingsModalController.error).toEqual(message);
    });
});