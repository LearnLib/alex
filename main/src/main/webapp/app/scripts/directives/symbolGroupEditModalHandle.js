(function () {
    'use strict';

    angular
        .module('weblearner.directives')
        .directive('symbolGroupEditModalHandle', symbolGroupEditModalHandle);

    symbolGroupEditModalHandle.$inject = ['$modal', 'paths'];

    /**
     *
     * @param $modal
     * @param paths
     * @returns {{scope: {group: string, onUpdated: string, onDeleted: string}, link: link}}
     */
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

        /**
         * @param scope
         * @param el
         * @param attrs
         */
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

                modal.result.then(function (data) {
                    if (data.status === 'updated') {
                        scope.onUpdated()(data.newGroup, data.oldGroup);
                    } else if (data.status === 'deleted') {
                        scope.onDeleted()(data.group);
                    }
                })
            }
        }
    }
}());