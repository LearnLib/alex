(function () {
    'use strict';

    angular
        .module('weblearner.models')
        .factory('Symbol', SymbolModel);

    SymbolModel.$inject = ['SymbolResource'];

    /**
     * The factory for the symbol model.
     *
     * @param SymbolResource - The resource to do CRUD operations on symbols
     * @returns {Symbol} - The symbol model
     * @constructor
     */
    function SymbolModel(SymbolResource) {

        /**
         * The symbol model.
         *
         * @param name - The name of the symbol
         * @param abbreviation - The abbreviation of the symbol
         * @constructor
         */
        function Symbol(name, abbreviation) {
            this.name = name || null;
            this.abbreviation = abbreviation || null;
            this.actions = [];
            this.id;
            this.revision;
            this.project;
            this.hidden;
            this.group;
        }

        /**
         * Create a copy of the instance
         *
         * @returns {SymbolModel.Symbol}
         */
        Symbol.prototype.copy = function () {
            return Symbol.build(angular.copy(this));
        };

        /**
         * Build a symbol instance from an object
         *
         * @param data - The data the symbol instance should be build from
         * @returns {SymbolModel.Symbol} - The symbol instance
         */
        Symbol.build = function (data) {
            var symbol = new Symbol(data.name, data.abbreviation);
            symbol.actions = data.actions;
            symbol.id = data.id;
            symbol.revision = data.revision;
            symbol.project = data.project;
            symbol.hidden = data.hidden;
            symbol.group = data.group;
            return symbol;
        };

        /**
         * Build an array of symbol instances from an object array
         *
         * @param data - The data the symobl instances should be build from
         * @returns {SymbolModel.Symbol[]} - The array of symbol instances
         */
        Symbol.buildSome = function (data) {
            var symbols = [];
            for (var i = 0; i < data.length; i++) {
                symbols.push(Symbol.build(data[i]))
            }
            return symbols;
        };

        /**
         * The symbol resource as a static property for easy access and the mapping of symbols to instances
         *
         * @type {SymbolResource}
         */
        Symbol.Resource = new SymbolResource();

        // attach the build function of the symbol to the resource so that it can automatically create instances
        // of symbols from http responses
        Symbol.Resource.build = Symbol.build;
        Symbol.Resource.buildSome = Symbol.buildSome;

        return Symbol;
    }
}());