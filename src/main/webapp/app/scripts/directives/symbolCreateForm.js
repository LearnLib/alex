(function () {
    'use strict';

    angular
        .module('weblearner.directives')
        .directive('symbolCreateForm', [
            'paths',
            symbolCreateForm
        ]);

    function symbolCreateForm(paths) {

        var directive = {
            scope: {
                type: '@'
            },
            controller: [
                '$scope',
                controller
            ],
            templateUrl: paths.views.DIRECTIVES + '/symbol-create-form.html'
        };
        return directive;

        //////////

        function controller($scope) {

            $scope.symbol = {
                name: null,
                abbreviation: null,
                type: $scope.type
            };

            $scope.submitForm = function(){
                $scope.$emit('symbol.created', angular.copy($scope.symbol));
            }
        }

    }
}());