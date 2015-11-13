/**
 * The directive for handling the opening of the modal for creating a new symbol group. Can only be used as
 * an attribute and attaches a click event to its source element.
 *
 * Use: '<button symbol-group-create-modal-handle>Click Me!</button>'
 *
 * @param $modal - The ui.bootstrap $modal service
 * @returns {{restrict: string, link: link}}
 */
// @ngInject
function symbolGroupCreateModalHandle($modal) {
    return {
        restrict: 'A',
        link: link
    };

    function link(scope, el) {
        el.on('click', () => {
            $modal.open({
                templateUrl: 'views/modals/symbol-group-create-modal.html',
                controller: 'SymbolGroupCreateModalController',
                controllerAs: 'vm'
            });
        });
    }
}

export default symbolGroupCreateModalHandle;