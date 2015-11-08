(function () {
    'use strict';

    angular
        .module('ALEX.controllers')
        .controller('SymbolGroupCreateModalController', SymbolGroupCreateModalController);

    /**
     * The controller for the modal dialog that handles the creation of a new symbol group.
     *
     * @param $scope
     * @param $modalInstance
     * @param modalData
     * @param SymbolGroup
     * @param SymbolGroupResource
     * @param _
     * @param ToastService
     * @constructor
     */
    // @ngInject
    function SymbolGroupCreateModalController($scope, $modalInstance, modalData, SymbolGroup, SymbolGroupResource, _, ToastService) {

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
         * @type {SymbolGroup[]}
         */
        $scope.groups = [];

        /**
         * An error message that can be displayed in the modal template
         * @type {String|null}
         */
        $scope.errorMsg = null;

        // load all existing symbol groups
        (function init() {
            SymbolGroupResource.getAll(projectId)
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
                SymbolGroupResource.create(projectId, $scope.group)
                    .then(function (createdGroup) {
                        ToastService.success('Symbol group <strong>' + createdGroup.name + '</strong> created');
                        $modalInstance.close(createdGroup);
                    })
                    .catch(function (response) {
                        $scope.errorMsg = response.data.message;
                    });
            } else {
                $scope.errorMsg = 'The group name is already in use in this project';
            }
        };

        /**
         * Close the modal.
         */
        $scope.closeModal = function () {
            $modalInstance.dismiss();
        }
    }
}());