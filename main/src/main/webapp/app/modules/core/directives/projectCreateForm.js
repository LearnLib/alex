(function () {
    'use strict';

    angular
        .module('ALEX.core')
        .directive('projectCreateForm', projectCreateForm);

    projectCreateForm.$inject = ['$rootScope', 'paths', 'Project', 'ProjectResource', 'ToastService'];

    /**
     * The directive that renders the form to create a new project.
     *
     * Usage: <project-create-form></project-create-form>
     *
     * @param $rootScope
     * @param paths
     * @param Project
     * @param ProjectResource
     * @param Toast
     * @returns {{scope: {}, templateUrl: string, link: link}}
     */
    function projectCreateForm($rootScope, paths, Project, ProjectResource, Toast) {
        return {
            scope: {},
            templateUrl: paths.COMPONENTS + '/core/views/directives/project-create-form.html',
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
                        Toast.success('Project "' + createdProject.name + '" created');
                        $rootScope.$emit('project:created', createdProject);
                        scope.project = new Project();
                    })
                    .catch(function (response) {
                        Toast.danger('<p><strong>Creation of project failed</strong></p>' + response.data.message)
                    })
            }
        }
    }
}());