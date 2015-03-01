(function () {

    angular
        .module('weblearner.controller')
        .controller('GroupsController', GroupsController);

    GroupsController.$inject = ['$scope', 'SessionService', 'SymbolGroup', '_'];

    function GroupsController($scope, Session, SymbolGroup, _) {

        $scope.project = Session.project.get();
        $scope.groups = [];
        $scope.allSymbols = [];
        $scope.collapseAll = false;

        SymbolGroup.Resource.getAll($scope.project.id, {embedSymbols: true})
            .then(function (groups) {
                $scope.groups = groups;
                $scope.allSymbols = _.flatten(_.pluck($scope.groups, 'symbols'));
            });

        $scope.addGroup = function () {
        };

        $scope.deleteGroup = function () {
        };

        $scope.updateGroup = function () {
        }
    }
}());