(function () {
    'use strict';

    angular
        .module('weblearner.controller')
        .controller('ActionCreateModalController', ActionCreateModalController);

    ActionCreateModalController.$inject = ['$scope', '$modalInstance', 'modalData', 'actionTypes', 'Action'];

    function ActionCreateModalController($scope, $modalInstance, modalData, actionTypes, Action) {

        $scope.actionTypes = actionTypes;
        $scope.symbol = modalData.symbol;
        $scope.action = null;

        $scope.selectNewActionType = function (type) {
            $scope.action = Action.createByType(type);
        };

        $scope.createAction = function () {
            $modalInstance.close($scope.action);
        };

        $scope.closeModal = function () {
            $modalInstance.dismiss();
        };
    }
}());