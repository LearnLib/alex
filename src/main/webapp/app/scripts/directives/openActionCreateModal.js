(function () {
    'use strict';

    angular
        .module('weblearner.directives')
        .directive('openActionCreateModal', [
            '$modal', 'ngToast', 'paths',
            openActionCreateModal
        ]);

    function openActionCreateModal($modal, toast, paths) {

        var directive = {
            restrict: 'EA',
            scope: {
                symbol: '=',
                onCreated: '&'
            },
            link: link
        };
        return directive;

        //////////

        function link(scope, el, attr) {

            el.on('click', handleModal);

            function handleModal() {

                var modal = $modal.open({
                    templateUrl: paths.views.MODALS + '/action-create-modal.html',
                    controller: 'ActionCreateModalController',
                    resolve: {
                        modalData: function () {
                            return {
                                symbol: angular.copy(scope.symbol)
                            };
                        }
                    }
                });

                // when successfully creating a symbol at the new to the list
                modal.result.then(function (action) {
                    scope.onCreated()(action);
                    toast.create({
                        class: 'success',
                        content: 'Action created'
                    });
                });
            }
        }
    }
}());