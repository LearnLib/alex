/**
 * The directive that handles the modal window for the creation of a new symbol. It attaches an click event to the
 * attached element that opens the modal dialog.
 *
 * Use it as an Attribute like 'symbol-create-modal-handle' and add an attribute 'project-id' with the id of the
 * project and an attribute 'on-created' which expects a callback function from the directives parent controller.
 * The callback function should have one parameter that will be the newly created symbol.
 *
 * @param $modal - The $modal service
 * @returns {{restrict: string, scope: {}, link: link}}
 */
// @ngInject
function symbolCreateModalHandle($modal) {
    return {
        restrict: 'A',
        scope: {},
        link: link
    };

    function link(scope, el) {
        el.on('click', () => {
            $modal.open({
                templateUrl: 'views/modals/symbol-create-modal.html',
                controller: 'SymbolCreateModalController',
                resolve: {
                    modalData: function () {
                        return {
                            projectId: scope.projectId
                        }
                    }
                }
            });
        });
    }
}

export default symbolCreateModalHandle;