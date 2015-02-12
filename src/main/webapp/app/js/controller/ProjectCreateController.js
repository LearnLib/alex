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
     * @param $location
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

            console.log('asd');
            return;

            ProjectResource.create($scope.project)
                .then(function () {
                    $state.go('home');
                })
        };
    }
}());