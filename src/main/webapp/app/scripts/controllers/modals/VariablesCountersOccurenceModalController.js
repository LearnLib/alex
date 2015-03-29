(function () {
    'use strict';

    angular
        .module('weblearner.controller')
        .controller('VariablesCountersOccurrenceModalController', VariablesCountersOccurrenceModalController);

    VariablesCountersOccurrenceModalController.$inject = [
        '$scope', '$modalInstance', 'SessionService', 'SymbolGroup'
    ];

    function VariablesCountersOccurrenceModalController($scope, $modalInstance, Session, SymbolGroup) {

        var project = Session.project.get();

        $scope.occurrences = null;

        SymbolGroup.Resource.getAll(project.id, {embedSymbols: true})
            .then(function (groups) {
                $scope.occurrences = findOccurrences(groups);
            });

        function findOccurrences(groups) {

            var occurrences = {
                counters: [],
                variables: []
            };

            _.forEach(groups, function (group) {
                _.forEach(group.symbols, function (symbol) {
                    if (!symbol.hidden) {
                        _.forEach(symbol.actions, function (action, i) {
                            for (var prop in action) {

                                if (action.hasOwnProperty(prop) && angular.isString(action[prop])) {
                                    var foundCounters = action[prop].match(/{{#(.*?)}}/g);
                                    var foundVariables = action[prop].match(/{{\$(.*?)}}/g);

                                    if (foundCounters !== null) {
                                        _.forEach(foundCounters, function (counter) {
                                            occurrences.counters.push({
                                                group: group.name,
                                                symbol: symbol.name,
                                                action: i,
                                                name: counter.substring(2, counter.length - 2)
                                            })
                                        })
                                    }

                                    if (foundVariables !== null) {
                                        _.forEach(foundVariables, function (variable) {
                                            occurrences.variables.push({
                                                group: group.name,
                                                symbol: symbol.name,
                                                action: i,
                                                name: variable.substring(2, variable.length - 2)
                                            })
                                        })
                                    }
                                }
                            }
                        })
                    }
                })
            });

            return occurrences;
        }

        /** Close the modal dialog */
        $scope.close = function () {
            $modalInstance.dismiss();
        }
    }
}());