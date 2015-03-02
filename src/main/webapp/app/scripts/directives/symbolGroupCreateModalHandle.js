(function () {
    'use strict';

    angular
        .module('weblearner.directives')
        .directive('symbolGroupCreateModalHandle', symbolGroupCreateModalHandle);

    symbolGroupCreateModalHandle.$inject = ['$modal', 'paths'];

    function symbolGroupCreateModalHandle($modal, paths) {

        var directive = {
            scope: {
                projectId: '@',
                onCreated: '&'
            },
            link: link
        };
        return directive;

        function link(scope, el, attrs) {

            el.on('click', handleModal);

            function handleModal() {
                var modal = $modal.open({
                    templateUrl: paths.views.MODALS + '/symbol-group-create-modal.html',
                    controller: 'SymbolGroupCreateModalController',
                    resolve: {
                        modalData: function () {
                            return {
                                projectId: scope.projectId
                            };
                        }
                    }
                });
                modal.result.then(function (group) {
                    scope.onCreated()(group);
                })
            }
        }
    }
}());