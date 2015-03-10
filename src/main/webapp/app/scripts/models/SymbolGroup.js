(function () {

    angular
        .module('weblearner.models')
        .factory('SymbolGroup', SymbolGroupModel);

    SymbolGroupModel.$inject = ['SymbolGroupResource', 'Symbol', '_'];

    function SymbolGroupModel(SymbolGroupResource, Symbol, _) {

        function SymbolGroup(name) {
            this.name = name || null;
            this.id;
            this.project;
            this.symbols;
        }

        SymbolGroup.prototype.addSymbol = function (symbol) {
            if (angular.isArray(this.symbols)) {
                this.symbols.push(symbol);
            }
        };

        SymbolGroup.prototype.removeSymbol = function (symbol) {
            if (angular.isArray(this.symbols)) {
                _.remove(this.symbols, {id: symbol.id});
            }
        };

        SymbolGroup.prototype.copy = function () {
            return SymbolGroup.build(angular.copy(this));
        };

        SymbolGroup.build = function (data) {
            var group = new SymbolGroup(data.name);
            group.id = data.id;
            group.symbols = Symbol.buildSome(data.symbols);
            group.project = data.project;
            return group;
        };

        SymbolGroup.buildSome = function (data) {
            var groups = [];
            for (var i = 0; i < data.length; i++) {
                groups.push(SymbolGroup.build(data[i]));
            }
            return groups;
        };

        SymbolGroup.Resource = new SymbolGroupResource();
        SymbolGroup.Resource.build = SymbolGroup.build;
        SymbolGroup.Resource.buildSome = SymbolGroup.buildSome;

        return SymbolGroup;
    }
}());