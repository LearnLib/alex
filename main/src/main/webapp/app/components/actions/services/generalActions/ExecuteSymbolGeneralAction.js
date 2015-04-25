(function () {
    'use strict';

    angular
        .module('ALEX.actions')
        .factory('ExecuteSymbolGeneralAction', ExecuteSymbolGeneralActionFactory);

    ExecuteSymbolGeneralActionFactory.$inject = ['ActionService', 'AbstractAction', 'actionGroupTypes', 'actionTypes'];

    /**
     * The factory for ExecuteSymbolGeneralAction
     *
     * @param ActionService
     * @param AbstractAction
     * @param actionGroupTypes
     * @param actionTypes
     * @returns {ExecuteSymbolGeneralAction}
     * @constructor
     */
    function ExecuteSymbolGeneralActionFactory(ActionService, AbstractAction, actionGroupTypes, actionTypes) {

        /**
         * Executes another symbol before continuing with other actions
         *
         * @param {string} symbolName - The name of the symbol
         * @param {{id:number,revision:number}} idRevisionPair - The id/revision pair
         * @constructor
         */
        function ExecuteSymbolGeneralAction(symbolName, idRevisionPair) {
            AbstractAction.call(this, actionTypes[actionGroupTypes.GENERAL].EXECUTE_SYMBOL);

            var _symbol = {
                name: symbolName || null,
                revision: null
            };

            this.symbolToExecute = idRevisionPair || {id: null, revision: null};

            // some magic that works
            this.setSymbol = function (symbols) {
                var symbol;

                for (var i = 0; i < symbols.length; i++) {
                    if (symbols[i].name === _symbol.name) {
                        symbol = symbols[i];
                    }
                }

                if (angular.isDefined(symbol)) {
                    this.symbolToExecute = {
                        id: symbol.id,
                        revision: symbol.revision
                    };
                    _symbol.name = symbol.name;
                    _symbol.revision = symbol.revision;
                }
            };

            this.getSymbol = function () {
                return _symbol;
            }
        }

        ExecuteSymbolGeneralAction.prototype = Object.create(AbstractAction.prototype);

        /**
         * @returns {string}
         */
        ExecuteSymbolGeneralAction.prototype.toString = function () {
            return 'Execute symbol "' + this.getSymbol().name + '", rev. ' + this.symbolToExecute.revision;
        };

        ExecuteSymbolGeneralAction.prototype.set = function (key, value) {
            if (key === 'symbolToExecuteName') {
                this.getSymbol().name = value;
            } else {
                this[key] = value;
            }
        };

        ActionService.register(
            actionGroupTypes.GENERAL,
            actionTypes[actionGroupTypes.GENERAL].EXECUTE_SYMBOL,
            ExecuteSymbolGeneralAction
        );

        return ExecuteSymbolGeneralAction;
    }
}());
