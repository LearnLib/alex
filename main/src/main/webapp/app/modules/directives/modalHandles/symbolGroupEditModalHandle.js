(function () {
    'use strict';

    angular
        .module('ALEX.directives')
        .directive('symbolGroupEditModalHandle', symbolGroupEditModalHandle);

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
     * @param SymbolGroup - The symbolGroup model
     * @returns {{scope: {group: string, onUpdated: string, onDeleted: string}, link: link}}
     */
    // @ngInject
    function symbolGroupEditModalHandle($modal, SymbolGroup) {
        return {
            restrict: 'A',
            scope: {
                group: '=',
                onUpdated: '&',
                onDeleted: '&'
            },
            link: link
        };

        function link(scope, el) {
            el.on('click', () => {
                $modal.open({
                    templateUrl: 'views/modals/symbol-group-edit-modal.html',
                    controller: 'SymbolGroupEditModalController',
                    resolve: {
                        modalData: function () {
                            return {
                                group: SymbolGroup.build(scope.group)
                            }
                        }
                    }
                })
            });
        }
    }
}());