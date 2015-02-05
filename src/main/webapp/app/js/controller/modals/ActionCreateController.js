(function(){
    'use strict';

    angular
        .module('weblearner.controller')
        .controller('ActionCreateController', [
            '$scope', '$modalInstance', 'modalData', 'WebActionTypesEnum', 'RestActionTypesEnum',
            ActionCreateController
        ]);

    function ActionCreateController ($scope, $modalInstance, modalData, WebActionTypesEnum, RestActionTypesEnum) {

        $scope.webActionTypes = WebActionTypesEnum;
        $scope.restActionTypes = RestActionTypesEnum;

        //////////

        $scope.symbol = modalData.symbol;
        $scope.action = {type: null};

        //////////

        $scope.createAction = function(){
            $modalInstance.close($scope.action);
        };

        $scope.closeModal = function(){
            $modalInstance.dismiss();
        }
    }
}());