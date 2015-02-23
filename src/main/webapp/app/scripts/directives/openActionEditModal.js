(function () {
    'use strict';

    angular
        .module('weblearner.directives')
        .directive('openActionEditModal', [
            '$modal', 'ngToast', 'paths',
            openActionEditModal
        ]);

    function openActionEditModal($modal, toast, paths) {
        var directive = {
            restrict: 'EA',
            scope: {
                symbol: '=',
                action: '=',
                onUpdated: '&'
            },
            link: link
        };
        return directive;

        //////////

        function link(scope, el, attr) {

            el.on('click', handleModal);

            function handleModal() {

                if (angular.isUndefined(scope.action)) {
                    return;
                }

                var modal = $modal.open({
                    templateUrl: paths.views.MODALS + '/action-edit-modal.html',
                    controller: 'ActionEditModalController',
                    resolve: {
                        modalData: function () {
                            return {
                                symbol: angular.copy(scope.symbol),
                                action: angular.copy(scope.action)
                            };
                        }
                    }
                });

                // when successfully creating a symbol at the new to the list
                modal.result.then(function (action) {
                    toast.create({
                        class: 'success',
                        content: 'Action updated'
                    });
                    scope.onUpdated()(action);
                });
            }
        }
    }
}());