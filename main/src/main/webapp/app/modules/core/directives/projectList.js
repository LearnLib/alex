(function () {
    'use strict';

    angular
        .module('ALEX.core')
        .directive('projectList', projectList);

    projectList.$inject = ['$rootScope', '$state', 'paths', 'ProjectResource', 'ToastService', '_', 'SessionService'];

    function projectList($rootScope, $state, paths, ProjectResource, Toast, _, Session) {
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
                    scope.projects = projects;
                });

            scope.openProject = function (project) {
                Session.project.save(project);
                $state.go('dashboard');
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