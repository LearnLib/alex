(function () {
    'use strict';

    angular
        .module('weblearner.controller')
        .controller('ProjectCreateController', [
            '$scope', '$location', 'ProjectResource',
            ProjectCreateController
        ]);

    /**
     * create a new project
     * @template 'app/partials/project-create.html'
     * @param $scope
     * @param $location
     * @param Project
     * @constructor
     */
    function ProjectCreateController($scope, $location, ProjectResource) {

        /** @type {{}} */
        $scope.project = {};

        //////////

        /**
         * create a new project
         */
        $scope.createProject = function () {
            if ($scope.create_form.$valid) {
                ProjectResource.create($scope.project)
                    .then(function (project) {
                        $location.path('/');
                    })
            } else {
                $scope.create_form.submitted = true;
            }
        };

        /**
         * reset the form
         */
        $scope.reset = function () {
            $scope.project = {}
        }
    }
}());