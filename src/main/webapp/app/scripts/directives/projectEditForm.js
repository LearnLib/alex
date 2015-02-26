(function () {
    'use strict';

    angular
        .module('weblearner.directives')
        .directive('projectEditForm', [
            'paths',
            projectEditForm
        ]);

    function projectEditForm(paths) {

        var directive = {
            scope: {
                project: '&'
            },
            controller: ['$scope', controller],
            templateUrl: paths.views.DIRECTIVES + '/project-edit-form.html'
        };
        return directive;

        function controller($scope) {

            $scope.project = angular.copy($scope.project());
            $scope.copy = angular.copy($scope.project);

            $scope.submitForm = function () {
                $scope.$emit('project.edited', $scope.project);
                $scope.copy = angular.copy($scope.project);
            };

            $scope.resetForm = function () {
                $scope.project = angular.copy($scope.copy);
            }
        }
    }
}());