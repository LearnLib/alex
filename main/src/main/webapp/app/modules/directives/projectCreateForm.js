(function () {
    'use strict';

    angular
        .module('ALEX.directives')
        .directive('projectCreateForm', projectCreateForm);

    /**
     * The directive that renders the form to create a new project.
     *
     * Usage: <project-create-form></project-create-form>
     *
     * @param $rootScope
     * @param Project
     * @param ProjectResource
     * @param ToastService
     * @returns {{scope: {}, templateUrl: string, link: link}}
     */
    // @ngInject
    function projectCreateForm($rootScope, Project, ProjectResource, ToastService) {
        return {
            scope: {},
            templateUrl: 'views/directives/project-create-form.html',
            link: link
        };

        function link(scope) {

            /**
             * The empty project model that is used for the form
             * @type {Project}
             */
            scope.project = new Project();

            /** Creates a new project */
            scope.createProject = function () {
                ProjectResource.create(scope.project)
                    .then(function (createdProject) {
                        ToastService.success('Project "' + createdProject.name + '" created');
                        $rootScope.$emit('project:created', createdProject);
                        scope.project = new Project();
                    })
                    .catch(function (response) {
                        ToastService.danger('<p><strong>Creation of project failed</strong></p>' + response.data.message)
                    })
            }
        }
    }
}());