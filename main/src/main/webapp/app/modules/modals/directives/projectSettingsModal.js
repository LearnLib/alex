(function () {
    'use strict';

    angular
        .module('ALEX.modals')
        .directive('projectSettingsModalHandle', projectSettingsModalHandle);

    projectSettingsModalHandle.$inject = ['$modal', 'paths', 'Project', 'LearnerResource', 'ToastService'];

    function projectSettingsModalHandle($modal, paths, Project, Learner, Toast) {
        return {
            restrict: 'A',
            scope: {
                project: '='
            },
            link: link
        };

        function link(scope, el) {
            el.on('click', handleModal);

            function handleModal() {

                // check if the current project is used in learning and abort deletion
                // because of unknown side effects
                Learner.isActive()
                    .then(function (data) {
                        if (data.active && data.project === scope.project.id) {
                            Toast.info('You cannot edit this project because a learning process is still active.');
                        } else {
                            $modal.open({
                                templateUrl: paths.COMPONENTS + '/modals/views/project-settings-modal.html',
                                controller: 'ProjectSettingsModalController',
                                resolve: {
                                    modalData: function () {
                                        return {
                                            project: Project.build(scope.project)
                                        }
                                    }
                                }
                            });
                        }
                    });
            }
        }
    }
}());