(function () {
    'use strict';

    angular
        .module('ALEX.controllers')
        .controller('ProjectsController', ProjectsController);

    /**
     * The controller that shows the page to manage projects
     *
     * @param $rootScope
     * @param $scope
     * @param $state
     * @param SessionService
     * @param ProjectResource
     * @constructor
     */
    // @ngInject
    function ProjectsController($rootScope, $scope, $state, SessionService, ProjectResource) {

        /**
         * The list of all projects
         * @type {Project[]}
         */
        $scope.projects = [];

        // go to the dashboard if there is a project in the session
        if (SessionService.project.get() !== null) {
            $state.go('dashboard');
        }

        ProjectResource.getAll()
            .then(function (projects) {
                $scope.projects = projects;
            });

        var projectCreatedOffHandler =
            $rootScope.$on('project:created', function (evt, project) {
                $scope.projects.push(project);
            });

        var projectUpdatedOffHandler =
            $rootScope.$on('project:updated', function (evt, project) {
                var index = _.findIndex($scope.projects, {id: project.id});
                if (index > -1) $scope.projects[index] = project;
            });

        var projectDeletedOffHandler =
            $rootScope.$on('project:deleted', function (evt, project) {
                _.remove($scope.projects, {id: project.id});
            });

        $scope.$on('$destroy', function () {
            projectCreatedOffHandler();
            projectUpdatedOffHandler();
            projectDeletedOffHandler();
        })
    }
}());