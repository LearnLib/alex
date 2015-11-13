/**
 * The directive that is used to handle the modal dialog for editing an action. Must be used as an attribute for the
 * attached element. It attaches a click event to the element that opens the modal dialog. Does NOT update the symbol
 * with the new action.
 *
 * The directive excepts two additional attributes. 'action' has to contain the action object to be edited.
 * 'onUpdated' has to be a function with one parameter where the updated action is passed on success.
 *
 * Can be used like this: '<button action-edit-modal-handle action="...">Click Me!</button>'
 *
 * @param $modal - The modal service
 * @param ActionService - ActionService
 * @returns {{restrict: string, scope: {action: string}, link: link}}
 */
// @ngInject
function actionEditModalHandle($modal, ActionService) {
    return {
        restrict: 'A',
        scope: {
            action: '='
        },
        link: link
    };

    function link(scope, el) {
        el.on('click', () => {
            $modal.open({
                templateUrl: 'views/modals/action-edit-modal.html',
                controller: 'ActionEditModalController',
                controllerAs: 'vm',
                resolve: {
                    modalData: function () {

                        // copy the id because it gets lost otherwise
                        const id = scope.action._id;
                        const action = ActionService.createFromType(scope.action);
                        action._id = id;

                        return {
                            action: action
                        };
                    }
                }
            });
        });
    }
}

export default actionEditModalHandle;