import {events} from '../../constants';

/**
 * The controller for the modal dialog that handles the creation of a new symbol group.
 *
 * @param $scope
 * @param $modalInstance
 * @param SessionService
 * @param SymbolGroup
 * @param SymbolGroupResource
 * @param _
 * @param ToastService
 * @param EventBus
 * @constructor
 */
// @ngInject
function SymbolGroupCreateModalController($scope, $modalInstance, SessionService, SymbolGroup, SymbolGroupResource,
                                          _, ToastService, EventBus) {

    // the id of the project where the new symbol group should be created in
    const project = SessionService.project.get();

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
    SymbolGroupResource.getAll(project.id).then(groups => {
        $scope.groups = groups;
    });

    /**
     * Creates a new symbol group and closes the modal on success and passes the newly created symbol group
     */
    $scope.createGroup = function () {
        $scope.errorMsg = null;

        const index = _.findIndex($scope.groups, {name: $scope.group.name});

        if (index === -1) {
            SymbolGroupResource.create(project.id, $scope.group)
                .then(createdGroup => {
                    ToastService.success('Symbol group <strong>' + createdGroup.name + '</strong> created');
                    EventBus.emit(events.GROUP_CREATED, {
                        group: createdGroup
                    });
                    $modalInstance.dismiss();
                })
                .catch(response => {
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

export default SymbolGroupCreateModalController;