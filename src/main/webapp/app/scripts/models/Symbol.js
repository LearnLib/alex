(function(){
    'use strict';

    angular
        .module('weblearner.models')
        .factory('Symbol', SymbolModel);

    function SymbolModel(){

        function Symbol(name, abbreviation) {
            this.name = name;
            this.abbreviation = abbreviation;
            this.actions = [];
            this.id;
            this.revision;
            this.project;
            this.group;
        }

        Symbol.build = function(data){
            var symbol = new Symbol(data.name, data.abbreviation);
            symbol.actions = data.actions;
            symbol.id = data.id;
            symbol.revision = data.revision;
            symbol.project = data.project;
            symbol.group = data.group;
            return symbol;
        };

        Symbol.Resource = {};
        Symbol.Resource.build = Symbol.build;

        return Symbol;
    }
}());