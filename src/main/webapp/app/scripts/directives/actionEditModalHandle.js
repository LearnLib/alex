(function () {
    'use strict';

    angular
        .module('weblearner.directives')
        .directive('actionEditModalHandle', actionEditModalHandle);

    actionEditModalHandle.$inject = ['$modal', 'paths'];

    /**
     * The directive that is used to handle the modal dialog for editing an action. Must be used as an attribute for the
     * attached element. It attaches a click event to the element that opens the modal dialog. Does NOT update the symbol
     * with the new action.
     *
     * The directive excepts two additional attributes. 'action' has to contain the action object to be edited.
     * 'onUpdated' has to be a function with one parameter where the updated action is passed on success.
     *
     * Can be used like this: '<button action-edit-modal-handle action="..." on-updated="...">Click Me!</button>'
     *
     * @param $modal - The modal service
     * @param paths - The applications paths constant
     * @returns {{restrict: string, scope: {action: string, onUpdated: string}, link: link}}
     */
    function actionEditModalHandle($modal, paths) {

        // the directive
        return {
            restrict: 'A',
            scope: {
                action: '=',
                onUpdated: '&'
            },
            link: link
        };

        // handles the directives logic
        function link(scope, el, attr) {
            el.on('click', handleModal);

            function handleModal() {

                // create and open the modal dialog
                var modal = $modal.open({
                    templateUrl: paths.views.MODALS + '/action-edit-modal.html',
                    controller: 'ActionEditModalController',
                    resolve: {
                        modalData: function () {
                            return {
                                action: scope.action
                            };
                        }
                    }
                });

                // when successfully creating an action, call the callback function and pass the updated action
                modal.result.then(function (action) {
                    scope.onUpdated()(action);
                });
            }
        }
    }
}());