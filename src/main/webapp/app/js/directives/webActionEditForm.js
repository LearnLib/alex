(function () {
    'use strict';

    angular
        .module('weblearner.directives')
        .directive('webActionEditForm', [
            'paths',
            webActionEditForm
        ]);

    function webActionEditForm(paths) {

        var directive = {
            scope: {
                action: '&'
            },
            templateUrl: paths.PARTIALS_DIRECTIVES + '/web-action-edit-form.html',
            controller: [
                '$scope', 'WebActionTypes',
                controller
            ]
        };
        return directive;

        //////////

        function controller($scope, WebActionTypes) {

            $scope.action = angular.copy($scope.action());
            $scope.actionTypes = WebActionTypes;

            $scope.submitForm = function(){
                $scope.$emit('action.edited', angular.copy($scope.action));
            }
        }
    }
}());