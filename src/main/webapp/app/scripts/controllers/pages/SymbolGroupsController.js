(function () {

    angular
        .module('weblearner.controller')
        .controller('SymbolGroupsController', SymbolGroupsController);

    SymbolGroupsController.$inject = ['$scope', 'SessionService', 'SymbolGroup', '_'];

    function SymbolGroupsController($scope, Session, SymbolGroup, _) {

        $scope.project = Session.project.get();
        $scope.groups = [];
        $scope.allSymbols = [];

        SymbolGroup.Resource.getAll($scope.project.id, {embedSymbols: true})
            .then(function (groups) {
                $scope.groups = groups;
                $scope.allSymbols = _.flatten(_.pluck($scope.groups, 'symbols'));
            });

        $scope.toggleCollapseAllGroups = function () {
            _.forEach($scope.groups, function (group) {
                group._isCollapsed = !group._isCollapsed;
            })
        }
    }
}());