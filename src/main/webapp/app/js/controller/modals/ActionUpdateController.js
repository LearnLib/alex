(function () {
    'use strict';

    angular
        .module('weblearner.controller')
        .controller('ActionUpdateController', [
            '$scope', '$modalInstance', 'modalData', 'WebActionTypesEnum', 'RestActionTypesEnum',
            ActionUpdateController
        ]);

    function ActionUpdateController($scope, $modalInstance, modalData, WebActionTypesEnum, RestActionTypesEnum) {

        $scope.webActionTypes = WebActionTypesEnum;
        $scope.restActionTypes = RestActionTypesEnum;

        //////////

        $scope.symbol = modalData.symbol;
        $scope.action = angular.copy(modalData.action);

        //////////

        $scope.updateAction = function () {
            $modalInstance.close($scope.action);
        };

        $scope.closeModal = function () {
            $modalInstance.dismiss();
        }
    }
}());