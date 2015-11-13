import {Project} from '../../entities/Project';

// @ngInject
function projectSettingsModalHandle($modal, LearnerResource, ToastService) {
    return {
        restrict: 'A',
        scope: {
            project: '='
        },
        link: link
    };

    function link(scope, el) {
        el.on('click', () => {

            // check if the current project is used in learning and abort deletion
            // because of unknown side effects
            LearnerResource.isActive()
                .then(data => {
                    if (data.active && data.project === scope.project.id) {
                        ToastService.info('You cannot edit this project because a learning process is still active.');
                    } else {
                        $modal.open({
                            templateUrl: 'views/modals/project-settings-modal.html',
                            controller: 'ProjectSettingsModalController',
                            controllerAs: 'vm',
                            resolve: {
                                modalData: function () {
                                    return {project: new Project(scope.project)}
                                }
                            }
                        });
                    }
                });
        });
    }
}

export default projectSettingsModalHandle;