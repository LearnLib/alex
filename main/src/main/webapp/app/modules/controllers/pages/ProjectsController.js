(function () {
    'use strict';

    angular
        .module('ALEX.controllers')
        .controller('ProjectsController', ProjectsController);

    /**
     * The controller that shows the page to manage projects
     *
     * @param $scope
     * @param $state
     * @param SessionService
     * @param ProjectResource
     * @param EventBus
     * @param events
     * @param _
     * @constructor
     */
    // @ngInject
    function ProjectsController($scope, $state, SessionService, ProjectResource, EventBus, events, _) {

        /**
         * The list of all projects
         * @type {Project[]}
         */
        $scope.projects = [];

        // go to the dashboard if there is a project in the session
        if (SessionService.project.get() !== null) {
            $state.go('dashboard');
        }

        ProjectResource.getAll().then(projects => {
            $scope.projects = projects;
        });

        // listen on project create event
        EventBus.on(events.PROJECT_CREATED, (evt, data) => {
            $scope.projects.push(data.project);
        }, $scope);

        // listen on project update event
        EventBus.on(events.PROJECT_UPDATED, (evt, data) => {
            const project = data.project;
            const i = _.findIndex($scope.projects, {id: project.id});
            if (i > -1) $scope.projects[i] = project;
        }, $scope);

        // listen on project delete event
        EventBus.on(events.PROJECT_DELETED, (evt, data) => {
            _.remove($scope.projects, {id: data.project.id});
        }, $scope);
    }
}());