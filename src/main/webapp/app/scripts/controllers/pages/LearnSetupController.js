(function () {
    'use strict';

    angular
        .module('weblearner.controller')
        .controller('LearnSetupController', [
            '$scope', '$state', 'SymbolGroup', 'SessionService', 'SelectionService', 'EqOraclesEnum',
            'LearnAlgorithmsEnum', 'LearnerResource', 'ngToast',
            LearnSetupController
        ]);

    function LearnSetupController($scope, $state, SymbolGroup, SessionService, SelectionService, EqOracles,
                                  LearnAlgorithms, LearnerResource, toast) {

        $scope.project = SessionService.project.get();
        $scope.groups = [];
        $scope.allSymbols = [];
        $scope.collapseAll = false;

        $scope.learnConfiguration = {
            symbols: [],
            algorithm: LearnAlgorithms.EXTENSIBLE_LSTAR,
            eqOracle: {
                type: EqOracles.COMPLETE,
                minDepth: 1,
                maxDepth: 1
            },
            maxAmountOfStepsToLearn: 0
        };

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

        $scope.startLearning = function () {
            var selectedSymbols = SelectionService.getSelected($scope.allSymbols);

            // make sure there are selected symbols
            if (selectedSymbols.length) {

                // get id:revision pair from each selected symbol and add it to the learn configuration
                _.forEach(selectedSymbols, function (symbol) {
                    $scope.learnConfiguration.symbols.push({
                        id: symbol.id,
                        revision: symbol.revision
                    });
                });

                // start learning and go to the load page
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