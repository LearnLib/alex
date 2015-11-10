(function () {
    'use strict';

    angular
        .module('ALEX.directives')
        .directive('symbolEditModalHandle', symbolEditModalHandle);

    /**
     * The directive that handles the modal window for the editing of a new symbol. It attaches an click event to the
     * attached element that opens the modal dialog.
     *
     * Use it as an attribute like 'symbol-edit-modal-handle'
     *
     * @param $modal - The $modal service
     * @returns {{restrict: string, scope: {symbol: string, updateOnServer: string}, link: link}}
     */
    // @ngInject
    function symbolEditModalHandle($modal) {
        return {
            restrict: 'A',
            scope: {
                symbol: '=',
                updateOnServer: '='
            },
            link: link
        };

        function link(scope, el) {
            el.on('click', () => {
                $modal.open({
                    templateUrl: 'views/modals/symbol-edit-modal.html',
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
            });
        }
    }
}());