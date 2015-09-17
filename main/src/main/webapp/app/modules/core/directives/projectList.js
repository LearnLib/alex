(function () {
    'use strict';

    angular
        .module('ALEX.core')
        .directive('projectList', projectList);

    projectList.$inject = ['$rootScope', 'paths', 'ProjectResource', 'ToastService', '_'];

    function projectList($rootScope, paths, ProjectResource, Toast, _) {
        return {
            scope: true,
            templateUrl: paths.COMPONENTS + '/core/views/directives/project-list.html',
            link: link
        };

        function link(scope) {
            scope.projects = [];

            $rootScope.$on('project:created', function (event, project) {
                scope.projects.push(project);
            });

            $rootScope.$on('project:updated', function (event, project) {
                var index = _.findIndex(scope.projects, {id: project.id});
                if (index > -1) scope.projects[index] = project;
            });

            ProjectResource.getAll()
                .then(function (projects) {
                    console.log(projects);
                    scope.projects = projects;
                });

            scope.openProject = function (project) {
                console.log(project)
            };

            scope.deleteProject = function (project) {
                ProjectResource.delete(project)
                    .then(function () {
                        Toast.success('Project ' + project.name + ' deleted');
                        _.remove(scope.projects, {id: project.id});
                    })
            }
        }
    }
}());