/** The model for an occurrence */
class Occurrence {

    /**
     * Constructor
     * @param {SymbolGroup} group - The symbol group where the variable/counter is found
     * @param {Symbol} symbol - The symbol where the variable/counter is found
     * @param {number} actionPos - The position of the action in the symbol
     * @param {string} counterOrVariableName - the name of the variable with prefix $ or #
     */
    constructor(group, symbol, actionPos, counterOrVariableName) {
        this.group = group.name;
        this.symbol = symbol.name;
        this.action = actionPos;
        this.name = counterOrVariableName.substring(3, counterOrVariableName.length - 2);
    }
}


/**
 * The controller of the modal dialog that shows all occurrences of used variables and counters in a project in
 * all visible symbols.
 *
 * @param $scope - The controllers scope
 * @param $modalInstance - the ui.bootstrap $modalInstance service
 * @param SessionService - The SessionService
 * @param SymbolGroupResource - The API resource for symbol groups
 * @constructor
 */
// @ngInject
class VariablesCountersOccurrenceModalController {

    /**
     * Constructor
     * @param $modalInstance
     * @param SessionService
     * @param SymbolGroupResource
     */
    constructor($modalInstance, SessionService, SymbolGroupResource) {
        this.$modalInstance = $modalInstance;

        //the project that is in the session
        const project = SessionService.getProject();

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
        this.occurrences = null;

        // load all symbol groups and symbols
        SymbolGroupResource.getAll(project.id, {embedSymbols: true}).then(groups => {
            this.occurrences = this.findOccurrences(groups);
        });
    }

    /**
     * Finds all occurrences of variables and counters in all existing actions of the project.
     *
     * @param {SymbolGroup[]} groups - All symbol groups
     * @returns {{counters: Array, variables: Array}} - The occurrences
     */
    findOccurrences(groups) {
        const occurrences = {
            counters: [],
            variables: []
        };

        // iterate over all groups, each symbol and each action
        groups.forEach(group => {
            group.symbols.forEach(symbol => {

                // don't check deleted symbols since they don't matter
                if (!symbol.hidden) {
                    symbol.actions.forEach((action, i) => {

                        // check for each action property if a counter or a variable was found
                        for (var prop in action) {
                            if (action.hasOwnProperty(prop) && angular.isString(action[prop])) {

                                // list of found counters of a single action property
                                let foundCounters = action[prop].match(/{{#(.*?)}}/g);

                                // list of found variables of a single action property
                                let foundVariables = action[prop].match(/{{\$(.*?)}}/g);

                                // add found variables and counters to occurrences
                                if (foundCounters !== null) {
                                    foundCounters.forEach(counter => {
                                        occurrences.counters.push(new Occurrence(group, symbol, i, counter));
                                    });
                                }
                                if (foundVariables !== null) {
                                    foundVariables.forEach(variable => {
                                        occurrences.variables.push(new Occurrence(group, symbol, i, variable));
                                    });
                                }
                            }
                        }
                    });
                }
            });
        });

        return occurrences;
    }

    /** Close the modal dialog */
    close() {
        this.$modalInstance.dismiss();
    }
}

export default VariablesCountersOccurrenceModalController;