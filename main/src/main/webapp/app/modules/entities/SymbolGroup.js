(function () {

    angular
        .module('ALEX.entities')
        .factory('SymbolGroup', SymbolGroupFactory);

    /**
     * The service for the model of a symbol group
     *
     * @param Symbol - The Symbol model
     * @param _ - Lodash
     * @returns {SymbolGroup}
     * @constructor
     */
    // @ngInject
    function SymbolGroupFactory(Symbol, _) {

        /**
         * The symbol group model
         *
         * @param {string} name - The name of the symbol group
         * @constructor
         */
        function SymbolGroup(name) {
            this.name = name || null;
        }

        /**
         * Creates a SymbolGroup instance from an object
         *
         * @param {Object} data
         * @returns {SymbolGroup}
         */
        SymbolGroup.build = function (data) {
            return angular.extend(new SymbolGroup(data.name), {
                id: data.id,
                user: data.user,
                project: data.project,
                symbols: _.map(data.symbols, Symbol.build)
            });
        };

        /**
         * Creates SymbolGroup object[s] from a HTTP response. Removes all hidden symbols because they aren't needed
         *
         * @param {Object} response - The HTTP response
         * @returns {SymbolGroup|SymbolGroup[]}
         */
        SymbolGroup.transformApiResponse = function (response) {
            if (angular.isArray(response.data)) {
                return _(response.data)
                    // remove hidden symbols because they are never needed
                    .forEach(function (group) {
                        group.symbols = _.filter(group.symbols, {hidden: false})
                    })
                    .map(SymbolGroup.build)
                    .value();
            } else {
                return SymbolGroup.build(response.data);
            }
        };

        return SymbolGroup;
    }
}());