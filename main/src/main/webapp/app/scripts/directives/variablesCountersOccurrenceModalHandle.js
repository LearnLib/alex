(function () {
    'use strict';

    angular
        .module('weblearner.directives')
        .directive('variablesCountersOccurrenceModalHandle', variablesCountersOccurrenceModalHandle);

    variablesCountersOccurrenceModalHandle.$inject = ['$modal', 'paths'];

    /**
     * The directive that handles the opening of the modal dialog that shows occurrences of variables and counters. Can
     * only be used as an attribute and attaches a click event to the element that opens the modal.#
     *
     * Use: <button variabales-counters-occurrence-modal-handle>Click Me!</button>
     *
     * @param $modal - The ui.bootstrap $modal service
     * @param paths - The application constant with paths
     * @returns {{restrict: string, link: link}}
     */
    function variablesCountersOccurrenceModalHandle($modal, paths) {
        return {
            restrict: 'A',
            link: link
        };
        function link(scope, el, attrs) {
            el.on('click', function () {
                var modal = $modal.open({
                    templateUrl: paths.views.MODALS + '/variables-counters-occurrence-modal.html',
                    controller: 'VariablesCountersOccurrenceModalController'
                });
            });
        }
    }
}());