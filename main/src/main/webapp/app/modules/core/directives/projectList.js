(function () {
    'use strict';

    angular
        .module('ALEX.core')
        .directive('projectList', projectList);

    projectList.$inject = ['$rootScope', '$state', 'paths', 'ProjectResource', 'ToastService', 'SessionService', 'PromptService'];

    /**
     * The directive that displays a list of projects.
     *
     * Usage: <project-list projects="..."></project-list> where property 'projects' expects an array of projects.
     *
     * @param $rootScope
     * @param $state
     * @param paths
     * @param ProjectResource
     * @param Toast
     * @param Session
     * @param PromptService
     * @returns {{scope: {projects: string}, templateUrl: string, link: link}}
     */
    function projectList($rootScope, $state, paths, ProjectResource, Toast, Session, PromptService) {
        return {
            scope: {
                projects: '='
            },
            templateUrl: paths.COMPONENTS + '/core/views/directives/project-list.html',
            link: link
        };

        function link(scope) {

            /**
             * Save a project into the sessionStorage and redirect to its dashboard
             * @param {Project} project - The project to work on
             */
            scope.openProject = function (project) {
                Session.project.save(project);
                $state.go('dashboard');
            };

            /**
             * Deletes a project
             * @param {Project} project - The project to delete
             */
            scope.deleteProject = function (project) {
                PromptService.confirm('Do you really want to delete this project? All related data will be lost.')
                    .then(function () {
                        ProjectResource.delete(project)
                            .then(function () {
                                Toast.success('Project ' + project.name + ' deleted');
                                $rootScope.$emit('project:deleted', project);
                            })
                    })
            }
        }
    }
}());