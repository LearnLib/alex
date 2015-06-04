(function () {
    'use strict';

    angular
        .module('ALEX.core')
        .factory('Symbol', SymbolModel);

    SymbolModel.$inject = ['_', 'ActionBuilder'];

    /**
     * The factory for the symbol model.
     *
     * @param _ - Lodash
     * @param ActionBuilder - The factory that creates Actions
     * @returns {Symbol} - The symbol model
     * @constructor
     */
    function SymbolModel(_, ActionBuilder) {

        /**
         * The symbol model
         *
         * @param {string} name - The name of the symbol
         * @param {string} abbreviation - The abbreviation of the symbol
         * @constructor
         */
        function Symbol(name, abbreviation) {
            this.name = name || null;
            this.abbreviation = abbreviation || null;
            this.actions = [];
        }

        /**
         * Builds a symbol instance from an object
         *
         * @param {Object} data - The data the symbol instance should be build from
         * @returns {Symbol} - The symbol instance
         */
        Symbol.build = function (data) {
            return angular.extend(new Symbol(
                data.name,
                data.abbreviation
            ), {
                actions: data.actions ? ActionBuilder.createFromObjects(data.actions) : [],
                id: data.id,
                revision: data.revision,
                project: data.project,
                hidden: data.hidden,
                group: data.group
            });
        };

        /**
         * Creates [an] instance[s] of Symbol from a HTTP response
         *
         * @param {Object} response - The response object from the API
         * @returns {Symbol|Symbol[]} - The Symbol[s]
         */
        Symbol.transformApiResponse = function(response){
            if (angular.isArray(response.data)) {
                if (response.data.length > 0) {
                    return _.map(response.data, Symbol.build);
                } else {
                    return [];
                }
            } else {
                return Symbol.build(response.data);
            }
        };

        return Symbol;
    }
}());