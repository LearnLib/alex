(function () {
    'use strict';

    angular
        .module('weblearner.directives')
        .directive('openSymbolCreateModal', [
            '$modal', 'paths',
            openSymbolCreateModal
        ]);

    function openSymbolCreateModal($modal, paths) {
        var directive = {
            restrict: 'EA',
            scope: {
                symbolType: '@',
                projectId: '@',
                onCreated: '&'
            },
            link: link
        };
        return directive;

        //////////

        function link(scope, el, attrs) {

            el.on('click', handleModal);

            function handleModal() {
                var modal = $modal.open({
                    templateUrl: paths.views.MODALS + '/symbol-create-modal.html',
                    controller: 'SymbolCreateModalController',
                    resolve: {
                        modalData: function () {
                            return {
                                symbolType: scope.symbolType,
                                projectId: scope.projectId
                            }
                        }
                    }
                });
                modal.result.then(function (symbol) {
                    scope.onCreated()(symbol);
                })
            }
        }
    }
}());