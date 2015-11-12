/**
 * The controller that handles the modal dialog for changing the layout settings of a hyptothesis
 *
 * @param $scope - The controllers $scope
 * @param $modalInstance - The ui.bootstrap $modalInstance service
 * @param modalData - The data that is passed to the controller. Contains the object 'layoutSettings'
 * @constructor
 */
// @ngInject
function HypothesisLayoutSettingsController($scope, $modalInstance, modalData) {
    var defaultLayoutProperties = {
        nodesep: 50,
        edgesep: 25,
        ranksep: 50
    };

    $scope.layoutSettings = {};

    if (modalData.layoutSettings !== null) {
        $scope.layoutSettings = modalData.layoutSettings;
    } else {
        $scope.layoutSettings = defaultLayoutProperties;
    }

    $scope.update = function () {
        $modalInstance.close($scope.layoutSettings);
    };

    $scope.close = function () {
        $modalInstance.dismiss();
    };

    $scope.defaultLayoutSettings = function () {
        $scope.layoutSettings = defaultLayoutProperties;
    };
}

export default HypothesisLayoutSettingsController;