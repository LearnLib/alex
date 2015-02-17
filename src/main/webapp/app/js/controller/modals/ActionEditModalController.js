(function () {
    'use strict';

    angular
        .module('weblearner.controller')
        .controller('ActionEditModalController', [
            '$scope', '$modalInstance', 'modalData', 'WebActionTypes', 'RestActionTypes',
            ActionEditModalController
        ]);

    function ActionEditModalController($scope, $modalInstance, modalData, WebActionTypes, RestActionTypes) {

        $scope.webActionTypes = WebActionTypes;
        $scope.restActionTypes = RestActionTypes;

        //////////

        $scope.symbol = modalData.symbol;
        $scope.action = angular.copy(modalData.action);

        //////////

        $scope.$on('action.edited', updateAction);

        //////////

        function updateAction (evt, action) {
            $modalInstance.close(action);
        }

        //////////

        $scope.closeModal = function () {
            $modalInstance.dismiss();
        }
    }
}());