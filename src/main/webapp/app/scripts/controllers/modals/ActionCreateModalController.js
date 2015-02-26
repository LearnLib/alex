(function(){
    'use strict';

    angular
        .module('weblearner.controller')
        .controller('ActionCreateModalController', [
            '$scope', '$modalInstance', 'modalData', 'WebActionTypes', 'RestActionTypes',
            ActionCreateModalController
        ]);

    function ActionCreateModalController ($scope, $modalInstance, modalData, WebActionTypes, RestActionTypes) {

        $scope.webActionTypes = WebActionTypes;
        $scope.restActionTypes = RestActionTypes;
        $scope.symbol = modalData.symbol;

        //////////

        $scope.$on('action.created', createAction);

        //////////

        function createAction(evt, action) {
            $modalInstance.close(action);
        }

        //////////

        $scope.closeModal = function(){
            $modalInstance.dismiss();
        }
    }
}());