(function () {

    angular
        .module('weblearner.models')
        .factory('SymbolGroup', SymbolGroupModel);

    SymbolGroupModel.$inject = ['SymbolGroupResource', 'Symbol'];

    function SymbolGroupModel(SymbolGroupResource, Symbol) {

        function SymbolGroup(name) {
            this.name = name;
            this.id;
            this.project;
            this.symbols;
        }

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