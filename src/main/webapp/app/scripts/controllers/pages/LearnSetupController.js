(function () {
    'use strict';

    angular
        .module('weblearner.controller')
        .controller('LearnSetupController', [
            '$scope', '$state', 'SymbolGroup', 'SessionService', 'SelectionService', 'LearnConfiguration',
            'LearnerResource', 'ngToast',
            LearnSetupController
        ]);

    function LearnSetupController($scope, $state, SymbolGroup, SessionService, SelectionService, LearnConfiguration,
                                  LearnerResource, toast) {

        $scope.project = SessionService.project.get();
        $scope.groups = [];
        $scope.allSymbols = [];
        $scope.learnConfiguration = new LearnConfiguration();
        $scope.resetSymbol;

        //////////

        LearnerResource.isActive()
            .then(function (data) {
                if (data.active) {
                    if (data.project == $scope.project.id) {
                        $state.go('learn.start');
                    } else {
                        toast.create({
                            class: 'danger',
                            content: 'There is already running a test from another project.',
                            dismissButton: true
                        });
                    }
                } else {
                    SymbolGroup.Resource.getAll($scope.project.id, {embedSymbols: true})
                        .then(function (groups) {
                            $scope.groups = groups;
                            $scope.allSymbols = _.flatten(_.pluck($scope.groups, 'symbols'));
                        });
                }
            });

        //////////

        $scope.setResetSymbol = function (symbol) {
            $scope.resetSymbol = symbol;
        };

        $scope.startLearning = function () {
            var selectedSymbols = SelectionService.getSelected($scope.allSymbols);

            if (selectedSymbols.length && $scope.resetSymbol) {

                _.forEach(selectedSymbols, function (symbol) {
                    $scope.learnConfiguration.addSymbol(symbol)
                });

                $scope.learnConfiguration.setResetSymbol($scope.resetSymbol);

                LearnerResource.start($scope.project.id, $scope.learnConfiguration)
                    .then(function () {
                        $state.go('learn.start')
                    })
            }
        };

        $scope.updateLearnConfiguration = function (config) {
            $scope.learnConfiguration = config;
        };
    }
}());