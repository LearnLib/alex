(function () {
    'use strict';

    angular
        .module('weblearner.directives')
        .directive('symbolGroupCreateModalHandle', symbolGroupCreateModalHandle);

    symbolGroupCreateModalHandle.$inject = ['$modal', 'paths'];

    /**
     * The directive for handling the opening of the modal for creating a new symbol group. Can only be used as
     * an attribute and attaches a click event to its source element.
     *
     * Use: '<button symbol-group-create-modal-handle project-id=".." on-created="..">Click Me!</button>'
     *
     * @param $modal - The ui.bootstrap $modal service
     * @param paths - The applications paths constant
     * @returns {{restrict: string, scope: {projectId: string, onCreated: string}, link: link}}
     */
    function symbolGroupCreateModalHandle($modal, paths) {
        return {
            restrict: 'A',
            scope: {
                projectId: '@',
                onCreated: '&'
            },
            link: link
        };

        function link(scope, el, attrs) {
            el.on('click', handleModal);

            function handleModal() {
                var modal = $modal.open({
                    templateUrl: paths.views.MODALS + '/symbol-group-create-modal.html',
                    controller: 'SymbolGroupCreateModalController',
                    resolve: {
                        modalData: function () {
                            return {
                                projectId: scope.projectId
                            };
                        }
                    }
                });
                modal.result.then(function (group) {
                    scope.onCreated()(group);
                })
            }
        }
    }
}());