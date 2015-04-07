(function () {
    'use strict';

    angular
        .module('ALEX.directives')
        .directive('symbolMoveModalHandle', symbolMoveModalHandle);

    symbolMoveModalHandle.$inject = ['$modal', 'paths'];

    /**
     * The directive for handling the opening of the modal for moving symbols into another group. Can only be used as
     * an attribute and attaches a click event to its source element.
     *
     * Use: '<button symbol-move-modal-handle symbols="..." groups="..." onMoved="...">Click Me!</button>'
     *
     * @param $modal - The ui.bootstrap $modal service
     * @param paths - The applications paths constant
     * @returns {{scope: {symbols: string, groups: string, onMoved: string}, link: link}}
     */
    function symbolMoveModalHandle($modal, paths) {
        return {
            restrict: 'A',
            scope: {
                symbols: '=',
                groups: '=',
                onMoved: '&'
            },
            link: link
        };
        function link(scope, el, attrs) {
            el.on('click', function () {
                var modal = $modal.open({
                    templateUrl: paths.views.MODALS + '/symbol-move-modal.html',
                    controller: 'SymbolMoveModalController',
                    resolve: {
                        modalData: function () {
                            return {
                                symbols: scope.symbols,
                                groups: scope.groups
                            }
                        }
                    }
                });
                modal.result.then(function (data) {
                    scope.onMoved()(data.symbols, data.group);
                })
            });
        }
    }
}());