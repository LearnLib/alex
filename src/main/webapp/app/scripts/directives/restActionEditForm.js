(function () {
    'use strict';

    angular
        .module('weblearner.directives')
        .directive('restActionCreateForm', [
            'paths',
            restActionCreateForm
        ]);

    function restActionCreateForm(paths) {

        var directive = {
            scope: {},
            templateUrl: paths.views.DIRECTIVES + '/rest-action-create-form.html',
            controller: [
                '$scope', 'RestActionTypes',
                controller
            ]
        };
        return directive;

        //////////

        function controller($scope, RestActionTypes) {

            $scope.action = {};
            $scope.actionTypes = RestActionTypes;

            $scope.submitForm = function () {
                $scope.$emit('action.created', angular.copy($scope.action));
            }
        }
    }
}());
