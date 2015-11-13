/**
 * The directive that handles the opening of the modal dialog for layout setting of a hypothesis. Has to be used
 * as attribute. It attaches a click event to its element that opens the modal dialog.
 *
 * The corresponding controller should inject 'modalData' {Object}. It holds a property 'layoutSettings' which
 * contains the layoutSettings model.
 *
 * Attribute 'layoutSettings' {Object} should be the model that is passed to the hypothesis directive.
 * Attribute 'onUpdate' {function} should be a callback function with a single parameter for the settings
 *
 * Use: '<button hypothesis-layout-settings-modal-handle layout-settings="..." on-update="...">Click Me!</button>'
 *
 * @param $modal - The ui.boostrap $modal service
 * @returns {{restrict: string, scope: {layoutSettings: string}, link: link}}
 */
// @ngInject
function hypothesisLayoutSettingsModalHandle($modal) {
    return {
        restrict: 'A',
        scope: {
            layoutSettings: '=',
            onUpdate: '&'
        },
        link: link
    };

    function link(scope, el) {
        el.on('click', () => {
            var modal = $modal.open({
                templateUrl: 'views/modals/hypothesis-layout-settings-modal.html',
                controller: 'HypothesisLayoutSettingsController',
                controllerAs: 'vm',
                resolve: {
                    modalData: function () {
                        return {
                            layoutSettings: angular.copy(scope.layoutSettings)
                        }
                    }
                }
            });

            modal.result.then(layoutSettings => {
                scope.onUpdate()(layoutSettings);
            })
        });
    }
}

export default hypothesisLayoutSettingsModalHandle;