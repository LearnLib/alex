(function () {
    'use strict';

    angular
        .module('weblearner.services')
        .factory('SelectionService', SelectionService);

    SelectionService.$inject = ['_'];

    /**
     * Service with helper functions for selecting models.
     *
     * @param _ - Lodash
     * @returns {{getSelected: getSelected, removeSelection: removeSelection, isSelected: isSelected}}
     * @constructor
     */
    function SelectionService(_) {

        /**
         * The property whose value determines whether an object is selected or not.
         * @type {string}
         * @private
         */
        var _propertyName = "_selected";

        // the service
        return {
            getSelected: getSelected,
            removeSelection: removeSelection,
            isSelected: isSelected,
        };

        /**
         * Filters all objects where the property '_selected' doesn't exists or is false.
         *
         * @param {Object[]} items
         * @return {Object[]|[]}
         */
        function getSelected(items) {
            return _.filter(items, function (item) {
                return item[_propertyName] === true;
            });
        }

        /**
         * Removes the property '_selected' from all items.
         *
         * @param {Object[]|Object} items
         */
        function removeSelection(items) {
            if (!angular.isArray(items)) {
                items = [items];
            }
            _.forEach(items, function (item) {
                delete item[_propertyName];
            })
        }

        /**
         * Checks if an object is selected.
         *
         * @param {Object} item - The item whose status is checked
         * @returns {boolean} - Whether or not the item is selected
         */
        function isSelected(item) {
            return angular.isUndefined(item._selected) ? false : item._selected;
        }
    }
}());