(function () {
    'use strict';

    angular
        .module('ALEX.directives')
        .directive('symbolMoveModalHandle', symbolMoveModalHandle);

    /**
     * The directive for handling the opening of the modal for moving symbols into another group. Can only be used as
     * an attribute and attaches a click event to its source element.
     *
     * Use: '<button symbol-move-modal-handle symbols="..." groups="..." onMoved="...">Click Me!</button>'
     *
     * @param $modal - The ui.bootstrap $modal service
     * @returns {{scope: {symbols: string, groups: string, onMoved: string}, link: link}}
     */
    // @ngInject
    function symbolMoveModalHandle($modal) {
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
                    templateUrl: 'views/modals/symbol-move-modal.html',
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