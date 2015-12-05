import {events} from '../../constants';

/**
 * The controller that handles the modal dialog for deleting and updating a symbol group. The modal data that is
 * passed must have an property 'group' whose value should be an instance of SymbolGroup
 */
// @ngInject
class SymbolGroupEditModalController {

    /**
     * Constructor
     * @param $modalInstance
     * @param modalData
     * @param SymbolGroupResource
     * @param ToastService
     * @param EventBus
     */
    constructor($modalInstance, modalData, SymbolGroupResource, ToastService, EventBus) {
        this.$modalInstance = $modalInstance;
        this.SymbolGroupResource = SymbolGroupResource;
        this.ToastService = ToastService;
        this.EventBus = EventBus;

        /**
         * The symbol group that should be edited
         * @type {SymbolGroup}
         */
        this.group = modalData.group;

        /**
         * An error message that can be displayed in the template
         * @type {null|String}
         */
        this.errorMsg = null;
    }


    /** Updates the symbol group under edit and closes the modal dialog on success */
    updateGroup() {
        this.errorMsg = null;

        this.SymbolGroupResource.update(this.group)
            .then(updatedGroup => {
                this.ToastService.success('Group updated');
                this.EventBus.emit(events.GROUP_UPDATED, {
                    group: updatedGroup
                });
                this.$modalInstance.dismiss();
            })
            .catch(response => {
                this.errorMsg = response.data.message;
            });
    }

    /** Deletes the symbol group under edit and closes the modal dialog on success */
    deleteGroup() {
        this.errorMsg = null;

        this.SymbolGroupResource.remove(this.group)
            .then(() => {
                this.ToastService.success(`Group <strong>${this.group.name}</strong> deleted`);
                this.EventBus.emit(events.GROUP_DELETED, {
                    group: this.group
                });
                this.$modalInstance.dismiss();
            })
            .catch(response => {
                this.errorMsg = response.data.message;
            });
    }

    /** Closes the modal dialog */
    close() {
        this.$modalInstance.dismiss();
    }
}

export default SymbolGroupEditModalController;