(function () {
    'use strict';

    angular
        .module('weblearner.controller')
        .controller('VariablesCountersOccurrenceModalController', VariablesCountersOccurrenceModalController);

    VariablesCountersOccurrenceModalController.$inject = [
        '$scope', '$modalInstance', 'SessionService', 'SymbolGroup'
    ];

    /**
     * The controller of the modal dialog that shows all occurrences of used variables and counters in a project in
     * all visible symbols.
     *
     * @param $scope - The controllers scope
     * @param $modalInstance - the ui.bootstrap $modalInstance service
     * @param Session - The SessionService
     * @param SymbolGroup - The factory for symbol groups
     * @constructor
     */
    function VariablesCountersOccurrenceModalController($scope, $modalInstance, Session, SymbolGroup) {

        // the project in the session
        var project = Session.project.get();

        /**
         * The occurrences of all variables and counter that where found.
         *
         * occurrence object: {group: ..., symbol: ..., action: ..., name: ...} where
         *   group  := symbol group name
         *   symbol := symbol name
         *   action := action position
         *   name   := variable/counter name
         *
         * @type {null|{counters: Array, variables: Array}}
         */
        $scope.occurrences = null;

        // load all symbol groups and symbols
        SymbolGroup.Resource.getAll(project.id, {embedSymbols: true})
            .then(function (groups) {
                $scope.occurrences = findOccurrences(groups);
            });

        /**
         * Finds all occurrences of variables and counters in all existing actions of the project.
         *
         * @param {SymbolGroup[]} groups - All symbol groups
         * @returns {{counters: Array, variables: Array}} - The occurrences
         */
        function findOccurrences(groups) {
            var occurrences = {
                counters: [],
                variables: []
            };

            // list of found counters of a single action property
            var foundCounters;

            // list of found variables of a single action property
            var foundVariables;

            /**
             * Creates an occurrence object
             *
             * @param {SymbolGroup} group - The symbol group where the variable/counter is found
             * @param {Symbol} symbol - The symbol where the variable/counter is found
             * @param {number} actionPos - The position of the action in the symbol
             * @param {string} counterOrVariable - the name of the variable with prefix $ or #
             * @returns {{group: (group.name|*), symbol: *, action: *, name: string}}
             */
            function createOccurrence(group, symbol, actionPos, counterOrVariable) {
                return {
                    group: group.name,
                    symbol: symbol.name,
                    action: actionPos,
                    name: counterOrVariable.substring(3, counterOrVariable.length - 2)
                }
            }

            // iterate over all groups, each symbol and each action
            _.forEach(groups, function (group) {
                _.forEach(group.symbols, function (symbol) {

                    // don't check deleted symbols since they don't matter
                    if (!symbol.hidden) {
                        _.forEach(symbol.actions, function (action, i) {

                            // check for each action property if a counter or a variable was found
                            for (var prop in action) {
                                if (action.hasOwnProperty(prop) && angular.isString(action[prop])) {
                                    foundCounters = action[prop].match(/{{#(.*?)}}/g);
                                    foundVariables = action[prop].match(/{{\$(.*?)}}/g);

                                    // add found variables and counters to occurrences
                                    if (foundCounters !== null) {
                                        _.forEach(foundCounters, function (counter) {
                                            occurrences.counters.push(createOccurrence(group, symbol, i, counter));
                                        })
                                    }
                                    if (foundVariables !== null) {
                                        _.forEach(foundVariables, function (variable) {
                                            occurrences.variables.push(createOccurrence(group, symbol, i, variable));
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