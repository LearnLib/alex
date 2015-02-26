(function () {
    'use strict';

    angular
        .module('weblearner.directives')
        .directive('webActionCreateForm', [
            'paths',
            webActionCreateForm
        ]);

    function webActionCreateForm(paths) {

        var directive = {
            scope: {},
            templateUrl: paths.views.DIRECTIVES + '/web-action-create-form.html',
            controller: [
                '$scope', 'WebActionTypes',
                controller
            ]
        };
        return directive;

        //////////

        function controller($scope, WebActionTypes) {

            $scope.action = {};
            $scope.actionTypes = WebActionTypes;

            $scope.submitForm = function () {
                $scope.$emit('action.created', angular.copy($scope.action));
            }
        }
    }
}());