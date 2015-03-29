(function () {
    'use strict';

    angular
        .module('weblearner.directives')
        .directive('variablesCountersOccurrenceModalHandle', variablesCountersOccurrenceModalHandle);

    variablesCountersOccurrenceModalHandle.$inject = ['$modal', 'paths'];

    function variablesCountersOccurrenceModalHandle($modal, paths) {

        return {
            restrict: 'A',
            link: link
        };

        function link(scope, el, attrs) {

            el.on('click', function () {
                var modal = $modal.open({
                    templateUrl: paths.views.MODALS + '/variables-counters-occurrence-modal.html',
                    controller: 'VariablesCountersOccurrenceModalController',
                    resolve: {}
                });
            });
        }
    }
}());