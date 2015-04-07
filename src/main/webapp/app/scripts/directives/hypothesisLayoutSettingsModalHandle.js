(function () {
    'use strict';

    angular
        .module('ALEX.directives')
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
     *
     * Use: '<button hypothesis-layout-settings-modal-handle layout-settings="...">Click Me!</button>'
     *
     * @param $modal - The ui.boostrap $modal service
     * @param paths - The constant with application paths
     * @returns {{restrict: string, scope: {layoutSettings: string}, link: link}}
     */
    function hypothesisLayoutSettingsModalHandle($modal, paths) {

        // the directive
        return {
            restrict: 'A',
            scope: {
                layoutSettings: '='
            },
            link: link
        };

        // the directives behaviour
        function link(scope, el, attrs) {
            el.on('click', function () {
                var modal = $modal.open({
                    templateUrl: paths.views.MODALS + '/hypothesis-layout-settings-modal.html',
                    controller: 'HypothesisLayoutSettingsController',
                    resolve: {
                        modalData: function () {
                            return {
                                layoutSettings: scope.layoutSettings
                            }
                        }
                    }
                });

                modal.result.then(function (layoutSettings) {
                    scope.layoutSettings = layoutSettings
                })
            });
        }
    }
}());