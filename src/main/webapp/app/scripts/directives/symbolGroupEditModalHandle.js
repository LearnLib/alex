(function () {
    'use strict';

    angular
        .module('weblearner.directives')
        .directive('symbolGroupEditModalHandle', symbolGroupEditModalHandle);

    symbolGroupEditModalHandle.$inject = ['$modal', 'paths'];

    function symbolGroupEditModalHandle($modal, paths) {

        var directive = {
            scope: {
                group: '=',
                onUpdated: '&',
                onDeleted: '&'
            },
            link: link
        };
        return directive;

        function link(scope, el, attrs) {

            el.on('click', handleModal);

            function handleModal() {

                var modal = $modal.open({
                    templateUrl: paths.views.MODALS + '/symbol-group-edit-modal.html',
                    controller: 'SymbolGroupEditModalController',
                    resolve: {
                        modalData: function () {
                            return {
                                group: scope.group
                            }
                        }
                    }
                });

                // call the callback with the created symbol on success
                modal.result.then(function (data) {
                    if (data.status === 'updated') {
                        scope.onUpdated()(data.group);
                    } else if (data.status === 'deleted') {
                        scope.onDeleted()(data.group);
                    }
                })
            }
        }
    }
}());