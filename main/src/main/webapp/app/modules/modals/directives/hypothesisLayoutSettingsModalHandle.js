(function () {
    'use strict';

    angular
        .module('ALEX.modals')
        .directive('hypothesisLayoutSettingsModalHandle', hypothesisLayoutSettingsModalHandle);

    hypothesisLayoutSettingsModalHandle.$inject = ['$modal', 'paths'];

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
     * @param paths - The constant with application paths
     * @returns {{restrict: string, scope: {layoutSettings: string}, link: link}}
     */
    function hypothesisLayoutSettingsModalHandle($modal, paths) {
        return {
            restrict: 'A',
            scope: {
                layoutSettings: '=',
                onUpdate: '&'
            },
            link: link
        };

        function link(scope, el) {
            el.on('click', handleClick);

            function handleClick() {
                var modal = $modal.open({
                    templateUrl: paths.COMPONENTS + '/modals/views/hypothesis-layout-settings-modal.html',
                    controller: 'HypothesisLayoutSettingsController',
                    resolve: {
                        modalData: function () {
                            return {
                                layoutSettings: angular.copy(scope.layoutSettings)
                            }
                        }
                    }
                });

                modal.result.then(function (layoutSettings) {
                    scope.onUpdate()(layoutSettings);
                })
            }
        }
    }
}());