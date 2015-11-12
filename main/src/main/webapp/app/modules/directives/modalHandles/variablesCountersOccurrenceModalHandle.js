/**
 * The directive that handles the opening of the modal dialog that shows occurrences of variables and counters. Can
 * only be used as an attribute and attaches a click event to the element that opens the modal.#
 *
 * Use: <button variabales-counters-occurrence-modal-handle>Click Me!</button>
 *
 * @param $modal - The ui.bootstrap $modal service
 * @returns {{restrict: string, link: link}}
 */
// @ngInject
function variablesCountersOccurrenceModalHandle($modal) {
    return {
        restrict: 'A',
        link: link
    };

    function link(scope, el) {
        el.on('click', () => {
            $modal.open({
                templateUrl: 'views/modals/variables-counters-occurrence-modal.html',
                controller: 'VariablesCountersOccurrenceModalController'
            });
        });
    }
}

export default variablesCountersOccurrenceModalHandle;