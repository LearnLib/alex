/**
 * The directive that is used to handle the modal dialog for creating an action. Must be used as an attribute for
 * the attached element. It attaches a click event to the element that opens the modal dialog. Does NOT saves the
 * action on the server.
 *
 * Can be used like this: '<button action-create-modal-handle>Click Me!</button>'
 *
 * @param $modal - The modal service
 * @returns {{restrict: string, scope: {}, link: link}}
 */
// @ngInject
function actionCreateModalHandle($modal) {
    return {
        restrict: 'A',
        scope: {},
        link: link
    };

    function link(scope, el) {
        el.on('click', () => {
            $modal.open({
                templateUrl: 'views/modals/action-create-modal.html',
                controller: 'ActionCreateModalController',
                controllerAs: 'vm'
            });
        });
    }
}

export default actionCreateModalHandle;