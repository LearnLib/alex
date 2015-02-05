(function () {
    'use strict';

    angular
        .module('weblearner.directives')
        .directive('openSymbolUpdateModal', [
            '$modal',
            openSymbolUpdateModal
        ]);

    function openSymbolUpdateModal($modal) {

        var directive = {
            restrict: 'EA',
            scope: {
                symbol: '=',
                onUpdated: '&'
            },
            link: link
        };
        return directive;

        //////////

        function link(scope, el, attrs) {

            el.on('click', handleModal);

            function handleModal() {

                if (angular.isUndefined(scope.symbol)) {
                    return;
                }

                var modal = $modal.open({
                    templateUrl: 'app/partials/modals/modal-symbol-update.html',
                    controller: 'SymbolUpdateController',
                    resolve: {
                        modalData: function () {
                            return {
                                symbol: angular.copy(scope.symbol)
                            };
                        }
                    }
                });
                modal.result.then(function (symbol) {
                    scope.onUpdated()(symbol);
                })
            }
        }
    }
}());