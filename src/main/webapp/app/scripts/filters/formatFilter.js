(function () {
    'use strict';

    angular
        .module('weblearner.filters')
        .filter('formatEnumKey', formatEnumKey);

    function formatEnumKey() {
        return function (string) {
            return string.toLowerCase().split('_').join(' ').replace(/\w\S*/g, function (txt) {
                return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();
            })
        }
    }
}());