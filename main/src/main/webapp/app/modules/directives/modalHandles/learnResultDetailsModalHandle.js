/**
 * The directive that handles the modal dialog for displaying details about a learn result. Can only be used as
 * an attribute and expects a second attribute 'result' which should be the LearnResult whose details should be
 * shown. Attaches a click event on the element that opens the modal.
 *
 * Use it like this: '<button learn-result-details-modal-handle result="...">Click me!</button>'
 *
 * @param $modal - The modal service
 * @returns {{restrict: string, scope: {result: string}, link: link}}
 */
// @ngInject
function learnResultDetailsModalHandle($modal) {
    return {
        restrict: 'A',
        scope: {
            result: '='
        },
        link: link
    };

    function link(scope, el) {
        el.on('click', () => {
            $modal.open({
                templateUrl: 'views/modals/learn-result-details-modal.html',
                controller: 'LearnResultDetailsModalController',
                controllerAs: 'vm',
                resolve: {
                    modalData: function () {
                        return {result: scope.result}
                    }
                }
            })
        });
    }
}

export default learnResultDetailsModalHandle;