(function () {
    'use strict';

    angular
        .module('weblearner.directives')
        .directive('actionCreateModalHandle', actionCreateModalHandle);

    actionCreateModalHandle.$inject = ['$modal', 'paths'];

    /**
     * The directive that is used to handle the modal dialog for creating an action. Must be used as an attribute for
     * the attached element. It attaches a click event to the element that opens the modal dialog. Does NOT saves the
     * action on the server.
     *
     * The directive excepts one additional attribute. 'onCreated' has to be a function with one parameter where the
     * created action is passed on success.
     *
     * Can be used like this: '<button action-create-modal-handle on-created="...">Click Me!</button>'
     *
     * @param $modal - The modal service
     * @param paths - The applications paths constant
     * @returns {{restrict: string, scope: {onCreated: string}, link: link}}
     */
    function actionCreateModalHandle($modal, paths) {

        // the directive
        return {
            restrict: 'A',
            scope: {
                onCreated: '&'
            },
            link: link
        };

        // handles the directives logic
        function link(scope, el, attr) {
            el.on('click', handleModal);

            function handleModal() {

                // create the modal
                var modal = $modal.open({
                    templateUrl: paths.views.MODALS + '/action-create-modal.html',
                    controller: 'ActionCreateModalController',
                    resolve: {
                        modalData: function () {
                            return {
                                addAction: function (action) {
                                    if (action !== null) {
                                        scope.onCreated()(action);
                                    }
                                }
                            }
                        }
                    }
                });

                // call the callback on success
                modal.result.then(function (action) {
                    scope.onCreated()(action);
                });
            }
        }
    }
}());