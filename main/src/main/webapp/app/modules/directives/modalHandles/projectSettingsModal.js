(function () {
    'use strict';

    angular
        .module('ALEX.directives')
        .directive('projectSettingsModalHandle', projectSettingsModalHandle);

    // @ngInject
    function projectSettingsModalHandle($modal, Project, LearnerResource, ToastService) {
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
                LearnerResource.isActive()
                    .then(function (data) {
                        if (data.active && data.project === scope.project.id) {
                            ToastService.info('You cannot edit this project because a learning process is still active.');
                        } else {
                            $modal.open({
                                templateUrl: 'views/modals/project-settings-modal.html',
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