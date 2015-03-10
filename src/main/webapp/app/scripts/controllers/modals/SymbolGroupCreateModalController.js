(function () {
    'use strict';

    angular
        .module('weblearner.controller')
        .controller('SymbolGroupCreateModalController', SymbolGroupCreateModalController);

    SymbolGroupCreateModalController.$inject = [
        '$scope', '$modalInstance', 'modalData', 'SymbolGroup', '_', 'ToastService'
    ];

    /**
     * The controller for the modal dialog that handles the creation of a new symbol group.
     *
     * The template can be found at 'views/modals/symbol-create-modal.html'
     *
     * @param $scope
     * @param $modalInstance
     * @param modalData
     * @param SymbolGroup
     * @param _
     * @param Toast
     * @constructor
     */
    function SymbolGroupCreateModalController($scope, $modalInstance, modalData, SymbolGroup, _, Toast) {

        // the id of the project where the new symbol group should be created in
        var projectId = modalData.projectId;

        /**
         * The new symbol group
         * @type {SymbolGroup}
         */
        $scope.group = new SymbolGroup();

        /**
         * The list of all existing symbol groups. They are used in order to check if the name of the new symbol group
         * already exists
         * @type {Array}
         */
        $scope.groups = [];

        /**
         * An error message that can be displayed in the modal template
         * @type {String|null}
         */
        $scope.errorMsg = null;

        // load all existing symbol groups
        (function init() {
            SymbolGroup.Resource.getAll(projectId)
                .then(function (groups) {
                    $scope.groups = groups;
                });
        }());

        /**
         * Creates a new symbol group and closes the modal on success and passes the newly created symbol group
         */
        $scope.createGroup = function () {
            $scope.errorMsg = null;

            var index = _.findIndex($scope.groups, {name: $scope.group.name});

            if (index === -1) {
                SymbolGroup.Resource.create(projectId, $scope.group)
                    .then(function (newGroup) {
                        Toast.success('Symbol group <strong>' + newGroup.name + '</strong> created');
                        $modalInstance.close(newGroup);
                    })
                    .catch(function (response) {
                        $scope.errorMsg = response.data.message;
                    });
            } else {
                $scope.errorMsg = 'The group name is already in use in this project';
            }
        };

        /** Close the modal. */
        $scope.closeModal = function () {
            $modalInstance.dismiss();
        }
    }
}());