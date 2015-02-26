(function () {
    'use strict';

    angular
        .module('weblearner.directives')
        .directive('restActionEditForm', [
            'paths',
            restActionEditForm
        ]);

    function restActionEditForm(paths) {

        var directive = {
            scope: {
                action: '&'
            },
            templateUrl: paths.views.DIRECTIVES + '/rest-action-edit-form.html',
            controller: [
                '$scope', 'RestActionTypes',
                controller
            ]
        };
        return directive;

        //////////

        function controller($scope, RestActionTypes) {

            $scope.action = angular.copy($scope.action());
            $scope.actionTypes = RestActionTypes;

            $scope.submitForm = function () {
                $scope.$emit('action.edited', angular.copy($scope.action));
            }
        }
    }
}());