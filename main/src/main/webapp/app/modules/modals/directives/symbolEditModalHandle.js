(function () {
    'use strict';

    angular
        .module('ALEX.modals')
        .directive('symbolEditModalHandle', symbolEditModalHandle);

    symbolEditModalHandle.$inject = ['$modal', 'paths'];

    /**
     * The directive that handles the modal window for the editing of a new symbol. It attaches an click event to the
     * attached element that opens the modal dialog.
     *
     * Use it as an attribute like 'symbol-edit-modal-handle' and add an attribute 'on-created' which expects a callback
     * function from the directives parent controller. The callback function should have one parameter that will be the
     * newly updated symbol.
     *
     * @param $modal - The $modal service
     * @param paths - The constants for application paths
     * @returns {{restrict: string, scope: {symbol: string, onUpdated: string}, link: link}}
     */
    function symbolEditModalHandle($modal, paths) {

        return {
            restrict: 'A',
            scope: {
                symbol: '=',
                onUpdated: '&',
                updateOnServer: '='
            },
            link: link
        };

        /**
         * @param scope
         * @param el
         * @param attrs
         */
        function link(scope, el) {
            el.on('click', handleModal);

            function handleModal() {
                var modal = $modal.open({
                    templateUrl: paths.COMPONENTS + '/modals/views/symbol-edit-modal.html',
                    controller: 'SymbolEditModalController',
                    resolve: {
                        modalData: function () {
                            return {
                                symbol: scope.symbol,
                                updateOnServer: scope.updateOnServer
                            };
                        }
                    }
                });

                modal.result.then(function (symbol) {
                    scope.onUpdated()(symbol.new, symbol.old);
                })
            }
        }
    }
}());