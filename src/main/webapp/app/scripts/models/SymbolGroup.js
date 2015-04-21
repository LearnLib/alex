(function () {

    angular
        .module('ALEX.models')
        .factory('SymbolGroup', SymbolGroupModel);

    SymbolGroupModel.$inject = ['SymbolGroupResource', 'Symbol', '_'];

    /**
     * The service for the model of a symbol group
     *
     * @param SymbolGroupResource
     * @param Symbol
     * @param _
     * @returns {SymbolGroup}
     * @constructor
     */
    function SymbolGroupModel(SymbolGroupResource, Symbol, _) {

        /**
         * The symbol group model
         *
         * @param name - The name of the symbol group
         * @constructor
         */
        function SymbolGroup(name) {
            this.name = name || null;
            this.id;
            this.project;
            this.symbols;
        }

        /**
         * Creates a copy of the current instance
         *
         * @returns {*}
         */
        SymbolGroup.prototype.copy = function () {
            return SymbolGroup.build(angular.copy(this));
        };

        /**
         * Creates an instance of a SymbolGroup from a given object
         *
         * @param {Object} data - The object the SymbolGroup should be build from
         * @returns {SymbolGroup} - A new instance of SymbolGroup with the data
         */
        SymbolGroup.build = function (data) {
            var group = new SymbolGroup(data.name);
            group.id = data.id;
            group.symbols = Symbol.buildSome(_.filter(data.symbols, {hidden: false}));
            group.project = data.project;
            return group;
        };

        /**
         * Creates a list of instances of SymbolGroup from a given object list
         *
         * @param {Object[]} data - The list the array of SymbolGroup should be build from
         * @returns {SymbolGroup[]} - The list of SymbolGroups
         */
        SymbolGroup.buildSome = function (data) {
            var groups = [];
            for (var i = 0; i < data.length; i++) {
                groups.push(SymbolGroup.build(data[i]));
            }
            return groups;
        };

        // attach the resource of the symbol groups
        SymbolGroup.Resource = new SymbolGroupResource();

        // overwrite the build functions so that the resource creates instances of SymbolGroups
        SymbolGroup.Resource.build = SymbolGroup.build;
        SymbolGroup.Resource.buildSome = SymbolGroup.buildSome;

        return SymbolGroup;
    }
}());