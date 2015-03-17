(function () {
    'use strict';

    angular
        .module('weblearner.filters')
        .filter('capitalize', capitalize);

    /**
     * Capitalizes a given string
     *
     * @returns {Function} - The filter
     */
    function capitalize() {
        return function (string) {
            return string.charAt(0).toUpperCase() + string.slice(1);
        }
    }
}());