(function () {
    'use strict';

    angular
        .module('weblearner.directives')
        .directive('symbolEditForm', [
            'paths',
            symbolEditForm
        ]);

    function symbolEditForm(paths) {

        var directive = {
            scope: {
                symbol: '&'
            },
            controller: [
                '$scope',
                controller
            ],
            templateUrl: paths.PARTIALS_DIRECTIVES + '/symbol-edit-form.html'
        };
        return directive;

        //////////

        function controller($scope) {

            $scope.symbol = angular.copy($scope.symbol());

            $scope.submitForm = function(){
                $scope.$emit('symbol.edited', angular.copy($scope.symbol));
            }
        }

    }
}());