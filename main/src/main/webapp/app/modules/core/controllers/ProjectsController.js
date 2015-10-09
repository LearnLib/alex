(function () {
    'use strict';

    angular
        .module('ALEX.core')
        .controller('ProjectsController', ProjectsController);

    ProjectsController.$inject = ['$rootScope', '$scope', '$state', 'SessionService', 'ProjectResource'];

    /**
     * The controller that shows the page to manage projects
     *
     * @param $rootScope
     * @param $scope
     * @param $state
     * @param Session
     * @param ProjectResource
     * @constructor
     */
    function ProjectsController($rootScope, $scope, $state, Session, ProjectResource) {

        $scope.projects = [];

        // go to the dashboard if there is a project in the session
        if (Session.project.get() !== null) {
            $state.go('dashboard');
        }

        ProjectResource.getAll()
            .then(function (projects) {
                $scope.projects = projects;
            });

        $rootScope.$on('project:created', function (event, project) {
            $scope.projects.push(project);
        });

        $rootScope.$on('project:updated', function (event, project) {
            var index = _.findIndex($scope.projects, {id: project.id});
            if (index > -1) $scope.projects[index] = project;
        });
    }
}());