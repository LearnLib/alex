import {_} from '../../libraries';
import {events} from '../../constants';
import {Symbol} from '../../entities/Symbol';

/**
 * The controller that handles the import of symbols from a *.json file.
 *
 * @param $scope - The controllers scope
 * @param SessionService - The SessionService
 * @param SymbolResource - The Symbol API Resource handler
 * @param ToastService - The ToastService
 * @param EventBus - The EventBus
 * @constructor
 */
// @ngInject
function SymbolsImportController($scope, SessionService, SymbolResource, ToastService, EventBus) {

    // The project that is saved in the sessionStorage
    var project = SessionService.project.get();

    /**
     * The symbols that will be uploaded
     * @type {Symbol[]}
     */
    $scope.symbols = [];

    /**
     * The list of selected symbols
     * @type {Symbol[]}
     */
    $scope.selectedSymbols = [];

    /**
     * If references to symbol ids from executeSymbol actions should be adjusted or not
     * @type {boolean}
     */
    $scope.adjustReferences = true;

    // listen on the file loaded event
    EventBus.on(events.FILE_LOADED, (evt, data) => {
        $scope.fileLoaded(data.file);
    }, $scope);

    // listen on the symbol updated event
    EventBus.on(events.SYMBOL_UPDATED, (evt, data) => {
        $scope.updateSymbol(data.newSymbol, data.oldSymbol);
    }, $scope);

    /**
     * Creates instances of Symbols from the json string from the *.json file and puts them in the scope.
     *
     * @param {string} data - The json string of loaded symbols
     */
    $scope.fileLoaded = function (data) {
        try {
            $scope.symbols = angular.fromJson(data).map(s => new Symbol(s));
        } catch (e) {
            ToastService.danger('<p><strong>Loading json file failed</strong></p>' + e);
        }
    };

    /**
     * Makes an API request in order to create the selected symbols. Removes successfully created symbols from the
     * scope.
     */
    $scope.uploadSelectedSymbols = function () {
        if ($scope.selectedSymbols.length > 0) {
            SymbolResource.getAll(project.id)
                .then(function (existingSymbols) {
                    var maxId = _.max(existingSymbols, 'id').id;
                    var symbols = _($scope.selectedSymbols)
                        .map(s => new Symbol(s))
                        .forEach(function (symbol) {
                            delete symbol._collapsed;
                            delete symbol._selected;

                            // search in all actions of all symbols for an action with the type EXECUTE_SYMBOL and
                            // adjust referenced ids according to the max. existing id
                            if (existingSymbols.length > 0 && $scope.adjustReferences) {
                                _.forEach(symbol.actions, function (action) {
                                    if (action.type === 'executeSymbol') {
                                        action.symbolToExecute.id += maxId;
                                    }
                                })
                            }
                        })
                        .value();
                    SymbolResource.create(project.id, symbols)
                        .then(function (createdSymbols) {
                            ToastService.success('Symbols uploaded');
                            _.forEach(createdSymbols, function (symbol) {
                                _.remove($scope.symbols, {name: symbol.name})
                            })
                        })
                        .catch(function (response) {
                            ToastService.danger('<p><strong>Symbol upload failed</strong></p>' + response.data.message)
                        })
                });
        }
    };

    /**
     * Changes the name and/or the abbreviation a symbol before uploading it to prevent naming conflicts in the
     * database.
     *
     * @param {Symbol} updatedSymbol - The updated symbol
     * @param {Symbol} oldSymbol - The old symbol
     */
    $scope.updateSymbol = function (updatedSymbol, oldSymbol) {
        var symbol;

        // check whether name or abbreviation already exist and don't update symbol
        if (angular.equals(updatedSymbol, oldSymbol)) {
            return;
        } else if (updatedSymbol.name !== oldSymbol.name &&
            updatedSymbol.abbreviation === oldSymbol.abbreviation) {
            if (_.where($scope.symbols, {name: updatedSymbol.name}).length > 0) {
                ToastService.danger('Name <strong>' + updatedSymbol.name + '</strong> already exists');
                return;
            }
        } else if (updatedSymbol.abbreviation !== oldSymbol.abbreviation &&
            updatedSymbol.name === oldSymbol.name) {
            if (_.where($scope.symbols, {abbreviation: updatedSymbol.abbreviation}).length > 0) {
                ToastService.danger('Abbreviation <strong>' + updatedSymbol.abbreviation + '</strong> already exists');
                return;
            }
        }

        // update symbol in scope
        symbol = _.find($scope.symbols, {name: oldSymbol.name});
        symbol.name = updatedSymbol.name;
        symbol.abbreviation = updatedSymbol.abbreviation;
    }
}

export default SymbolsImportController;