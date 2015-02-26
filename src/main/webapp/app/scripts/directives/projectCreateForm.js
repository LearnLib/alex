(function(){
    'use strict';

    angular
        .module('weblearner.directives')
        .directive('projectCreateForm', [
            'paths',
            projectCreateForm
        ]);

    /**
     * projectCreateForm
     *
     * @param paths - The constant with relevant paths
     * @return {{scope: {}, controller: *[], templateUrl: string}}
     */
    function projectCreateForm(paths){

        var directive = {
            scope: {},
            controller: [
                '$scope',
                controller
            ],
            templateUrl: paths.views.DIRECTIVES + '/project-create-form.html'
        };
        return directive;

        function controller ($scope) {

            $scope.project = {
                name: null,
                baseUrl: null,
                description: null
            };

            $scope.submitForm = function() {
                $scope.$emit('project.created', angular.copy($scope.project));
            }
        }
    }
}());