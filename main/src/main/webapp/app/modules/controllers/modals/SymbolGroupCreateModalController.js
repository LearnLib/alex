import {events} from '../../constants';
import {SymbolGroupFormModel} from '../../entities/SymbolGroup';

/** The controller for the modal dialog that handles the creation of a new symbol group. */
// @ngInject
class SymbolGroupCreateModalController {

    /**
     * Constructor
     * @param $modalInstance
     * @param SessionService
     * @param SymbolGroupResource
     * @param ToastService
     * @param EventBus
     */
    constructor ($modalInstance, SessionService, SymbolGroupResource, ToastService, EventBus) {
        this.$modalInstance = $modalInstance;
        this.SymbolGroupResource = SymbolGroupResource;
        this.ToastService = ToastService;
        this.EventBus = EventBus;

        /**
         * The project that is in the session
         * @type {Project}
         */
        this.project = SessionService.project.get();

        /**
         * The new symbol group
         * @type {SymbolGroup}
         */
        this.group = new SymbolGroupFormModel();

        /**
         * The list of all existing symbol groups. They are used in order to check if the name of the new symbol group
         * already exists
         * @type {SymbolGroup[]}
         */
        this.groups = [];

        /**
         * An error message that can be displayed in the modal template
         * @type {String|null}
         */
        this.errorMsg = null;

        // load all existing symbol groups
        this.SymbolGroupResource.getAll(this.project.id).then(groups => {
            this.groups = groups;
        });
    }



    /** Creates a new symbol group and closes the modal on success and passes the newly created symbol group */
    createGroup () {
        this.errorMsg = null;

        const index = this.groups.findIndex(g => g.name === this.group.name);

        if (index === -1) {
            this.SymbolGroupResource.create(this.project.id, this.group)
                .then(createdGroup => {
                    this.ToastService.success('Symbol group <strong>' + createdGroup.name + '</strong> created');
                    this.EventBus.emit(events.GROUP_CREATED, {
                        group: createdGroup
                    });
                    this.$modalInstance.dismiss();
                })
                .catch(response => {
                    this.errorMsg = response.data.message;
                });
        } else {
            this.errorMsg = 'The group name is already in use in this project';
        }
    };

    /** Close the modal. */
    close () {
        this.$modalInstance.dismiss();
    }
}

export default SymbolGroupCreateModalController;