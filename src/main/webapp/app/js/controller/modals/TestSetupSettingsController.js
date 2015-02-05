(function () {
    'use strict';

    angular
        .module('weblearner.controller')
        .controller('TestSetupSettingsController', [
            '$scope', '$modalInstance', 'modalData', 'EqOraclesEnum', 'LearnAlgorithmsEnum', 'EqOracleService',
            TestSetupSettingsController
        ]);

    function TestSetupSettingsController($scope, $modalInstance, modalData, eqOracles, learnAlgorithms, EqOracleService) {

        $scope.eqOracles = eqOracles;
        $scope.learnAlgorithms = learnAlgorithms;
        $scope.learnConfiguration = modalData.learnConfiguration;

        //////////

        $scope.$watch('learnConfiguration.eqOracle.type', function(type){
            $scope.learnConfiguration.eqOracle = EqOracleService.create(type);
        });

        //////////

        $scope.ok = function () {
            $modalInstance.close($scope.learnConfiguration);
        };

        $scope.cancel = function () {
            $modalInstance.dismiss();
        }
    }
}());