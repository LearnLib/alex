import {events} from '../../constants';

/**
 * The controller of the modal window for editing a project
 *
 * @param $scope
 * @param $modalInstance
 * @param modalData
 * @param Project
 * @param ProjectResource
 * @param ToastService
 * @param EventBus
 * @constructor
 */
// @ngInject
function ProjectSettingsModalController($scope, $modalInstance, modalData, Project, ProjectResource, ToastService,
                                        EventBus) {

    /**
     * The project to edit
     * @type {Project}
     */
    $scope.project = modalData.project;

    /**
     * An error message that is displayed on a failed updated
     * @type {null|string}
     */
    $scope.error = null;

    /** Updates the project. Closes the modal window on success. */
    $scope.updateProject = function () {
        $scope.error = null;

        ProjectResource.update($scope.project)
            .then(updatedProject => {
                EventBus.emit(events.PROJECT_UPDATED, {project: updatedProject});
                $scope.closeModal();
                ToastService.success('Project updated');
            })
            .catch(response => {
                $scope.error = response.data.message;
            })
    };

    /** Closes the modal window */
    $scope.closeModal = function () {
        $modalInstance.dismiss();
    };
}

export default ProjectSettingsModalController;