(function () {
    'use strict';

    angular.module('ALEX.core').directive('projectCreateForm', projectCreateForm);

    projectCreateForm.$inject = ['$rootScope', 'paths', 'ProjectResource', 'ToastService'];

    function projectCreateForm($rootScope, paths, ProjectResource, Toast) {
        return {
            scope: true,
            templateUrl: paths.COMPONENTS + '/core/views/directives/project-create-form.html',
            link: link
        };

        function link(scope) {
            scope.project = {};

            scope.createProject = function () {
                ProjectResource.create(scope.project)
                    .then(function (createdProject) {
                        Toast.success('Project "' + createdProject.name + '" created');
                        $rootScope.$emit('project:created', createdProject);
                        scope.project = {};
                    })
                    .catch(function (response) {
                        Toast.danger('<p><strong>Creation of project failed</strong></p>' + response.data.message)
                    })
            }
        }
    }
}());