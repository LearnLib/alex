(function () {
    'use strict';

    angular
        .module('ALEX.actions')
        .factory('ExecuteSymbolGeneralAction', ['ActionService', 'AbstractAction', 'actionGroupTypes', 'actionTypes',
            function (ActionService, AbstractAction, actionGroupTypes, actionTypes) {

                function ExecuteSymbolGeneralAction(symbolName, idRevisionPair) {
                    AbstractAction.call(this, actionTypes[actionGroupTypes.GENERAL].EXECUTE_SYMBOL);

                    var _symbol = {
                        name: symbolName || null,
                        revision: null
                    };

                    this.symbolToExecute = idRevisionPair || {id: null, revision: null};

                    this.setSymbol = function (symbol) {
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

                ExecuteSymbolGeneralAction.prototype.toString = function () {
                    return 'Execute symbol "' + this.getSymbol().name + '", rev. ' + this.symbolToExecute.revision;
                };

                ActionService.register(actionGroupTypes.GENERAL, actionTypes[actionGroupTypes.GENERAL].EXECUTE_SYMBOL, ExecuteSymbolGeneralAction);

                return ExecuteSymbolGeneralAction;
            }])
}());
