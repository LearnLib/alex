(function () {
    'use strict';

    angular
        .module('weblearner.directives')
        .directive('symbolGroupEditModalHandle', symbolGroupEditModalHandle);

    symbolGroupEditModalHandle.$inject = ['$modal', 'paths'];

    /**
     * The directive that handles the opening of the modal for editing or deleting a symbol group. Can only be used as
     * attribute and attaches a click event to the source element that opens the modal.
     *
     * Attribute 'group' - The model for the symbol group
     * Attribute 'onUpdated' - The callback function with two parameters. First the updated and second the old group
     * Attribute 'onDeleted' - The callback function with one parameter - the deleted group object
     *
     * Use: '<button symbol-group-edit-modal group="..." on-updated="..." on-deleted="...">Click Me!</button>'
     *
     * @param $modal - The ui.bootstrap $modal service
     * @param paths - The applications paths constant
     * @returns {{scope: {group: string, onUpdated: string, onDeleted: string}, link: link}}
     */
    function symbolGroupEditModalHandle($modal, paths) {
        return {
            restrict: 'A',
            scope: {
                group: '=',
                onUpdated: '&',
                onDeleted: '&'
            },
            link: link
        };

        function link(scope, el, attrs) {
            el.on('click', handleModal);

            function handleModal() {
                var modal = $modal.open({
                    templateUrl: paths.views.MODALS + '/symbol-group-edit-modal.html',
                    controller: 'SymbolGroupEditModalController',
                    resolve: {
                        modalData: function () {
                            return {
                                group: scope.group
                            }
                        }
                    }
                });

                modal.result.then(function (data) {
                    if (data.status === 'updated') {
                        scope.onUpdated()(data.newGroup, data.oldGroup);
                    } else if (data.status === 'deleted') {
                        scope.onDeleted()(data.group);
                    }
                })
            }
        }
    }
}());