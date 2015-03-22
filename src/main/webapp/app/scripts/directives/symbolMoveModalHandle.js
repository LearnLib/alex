(function () {
    'use strict';

    angular
        .module('weblearner.directives')
        .directive('symbolMoveModalHandle', symbolMoveModalHandle);

    symbolMoveModalHandle.$inject = ['$modal', 'paths'];

    function symbolMoveModalHandle($modal, paths) {

        var directive = {
            scope: {
                symbols: '=',
                groups: '=',
                onMoved: '&'
            },
            link: link
        };
        return directive;

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