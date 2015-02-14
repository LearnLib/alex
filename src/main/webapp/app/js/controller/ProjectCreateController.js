(function () {
    'use strict';

    angular
        .module('weblearner.controller')
        .controller('ProjectCreateController', [
            '$scope', '$state', 'ProjectResource',
            ProjectCreateController
        ]);

    /**
     * ProjectCreateController
     *
     * The controller that handles the creation of new projects
     *
     * @param $scope
     * @param $state
     * @param ProjectResource
     * @constructor
     */
    function ProjectCreateController($scope, $state, ProjectResource) {

        $scope.project = {};

        //////////

        /**
         * create a new project
         */
        $scope.createProject = function () {
            ProjectResource.create($scope.project)
                .then(function () {
                    $state.go('home');
                })
        };
    }
}());