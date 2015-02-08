(function () {
    'use strict';

    angular
        .module('weblearner.controller')
        .controller('TestSetupController', [
            '$scope', '$location', 'SymbolResource', 'SessionService', 'SelectionService', 'type', 'EqOraclesEnum',
            'LearnAlgorithmsEnum', 'LearnerResource', 'ngToast',
            TestSetupController
        ]);

    function TestSetupController($scope, $location, SymbolResource, SessionService, SelectionService, type, EqOracles,
                                 LearnAlgorithms, LearnerResource, toast) {

        $scope.project = SessionService.project.get();
        $scope.symbols = [];
        $scope.type = type;
        $scope.testConfiguration = {
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
            .then(function (active) {
                if (active) {

                    if (data.project == $scope.project.id) {
                        $location.path('/project/' + $scope.project.id + '/learn');
                    } else {
                        toast.create({
                            class: 'danger',
                            content: 'There is already running a test from another project.',
                            dismissButton: true
                        });
                    }
                } else {
                    loadSymbols();
                }
            });

        //////////

        function loadSymbols() {
            switch (type) {
                case 'web':
                    SymbolResource.allWeb($scope.project.id)
                        .then(function (symbols) {
                            $scope.symbols = symbols;
                        });
                    break;
                case 'rest':
                    SymbolResource.allRest($scope.project.id)
                        .then(function (symbols) {
                            $scope.symbols = symbols;
                        });
                    break;
                default:
                    break;
            }
        }

        //////////

        $scope.startTest = function () {

            var selectedSymbols = SelectionService.getSelected($scope.symbols);

            if (selectedSymbols.length == 0) {
                return;
            }

            _.forEach(selectedSymbols, function (symbol) {
                $scope.testConfiguration.symbols.push({
                    id: symbol.id,
                    revision: symbol.revision
                });
            });

            LearnerResource.start($scope.project.id, $scope.testConfiguration)
                .then(function (data) {
                    $location.path('/project/' + $scope.project.id + '/learn');
                })
        };

        $scope.updateLearnConfiguration = function (config) {
            $scope.testConfiguration = config;
        };
    }
}());