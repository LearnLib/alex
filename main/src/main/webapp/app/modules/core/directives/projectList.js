(function () {
    'use strict';

    angular
        .module('ALEX.core')
        .directive('projectList', projectList);

    projectList.$inject = ['$state', 'paths', 'ProjectResource', 'ToastService', '_', 'SessionService'];

    function projectList($state, paths, ProjectResource, Toast, _, Session) {
        return {
            scope: {
                projects: '='
            },
            templateUrl: paths.COMPONENTS + '/core/views/directives/project-list.html',
            link: link
        };

        function link(scope) {

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