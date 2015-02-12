(function () {
    'use strict';

    angular
        .module('weblearner.controller')
        .controller('LearnSetupController', [
            '$scope', '$state', 'SymbolResource', 'SessionService', 'SelectionService', 'type', 'EqOraclesEnum',
            'LearnAlgorithmsEnum', 'LearnerResource', 'ngToast',
            LearnSetupController
        ]);

    function LearnSetupController($scope, $state, SymbolResource, SessionService, SelectionService, type, EqOracles,
                                 LearnAlgorithms, LearnerResource, toast) {

        $scope.project = SessionService.project.get();
        $scope.symbols = [];
        $scope.type = type;

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
                    SymbolResource.getAll($scope.project.id, {type:type})
                        .then(function(symbols){
                            $scope.symbols = symbols;
                        })
                }
            });

        //////////

        $scope.startLearning = function () {
            var selectedSymbols = SelectionService.getSelected($scope.symbols);

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