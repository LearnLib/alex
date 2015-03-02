(function () {
    'use strict';

    angular
        .module('weblearner.controller')
        .controller('ActionCreateModalController', [
            '$scope', '$modalInstance', 'modalData', 'actionTypes',
            ActionCreateModalController
        ]);

    function ActionCreateModalController($scope, $modalInstance, modalData, actionTypes) {

        $scope.actionTypes = actionTypes;
        $scope.selectedActionType;
        $scope.symbol = modalData.symbol;
        $scope.action;

        console.log($scope.actionTypes);

        $scope.createAction = function (action) {
            $modalInstance.close(action);
        };

        //////////

        $scope.closeModal = function () {
            $modalInstance.dismiss();
        }
    }
}());