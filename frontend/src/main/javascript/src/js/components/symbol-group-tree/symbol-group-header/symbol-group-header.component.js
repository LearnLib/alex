import {events} from '../../../constants';

export const symbolGroupHeaderComponent = {
    template: require('./symbol-group-header.component.html'),
    bindings: {
        group: '=',
        collapse: '='
    },
    transclude: true,
    controllerAs: 'vm',
    controller: class {

        /**
         * Constructor.
         *
         * @param {PromptService} PromptService
         * @param {SymbolGroupResource} SymbolGroupResource
         * @param {ToastService} ToastService
         * @param {EventBus} EventBus
         */
        // @ngInject
        constructor(PromptService, SymbolGroupResource, ToastService, EventBus) {
            this.promptService = PromptService;
            this.symbolGroupResource = SymbolGroupResource;
            this.toastService = ToastService;
            this.eventBus = EventBus;

            /**
             * The symbol group to display.
             * @type {SymbolGroup}
             */
            this.group = null;

            /**
             * If the group is collapsed.
             * @type {boolean}
             */
            this.collapse = false;
        }

        /**
         * Deletes the symbol group under edit and closes the modal dialog on success.
         */
        deleteGroup() {
            this.errorMsg = null;

            this.promptService.confirm('Are you sure that you want to delete the group? All symbols will be archived.')
                .then(() => {
                    this.symbolGroupResource.remove(this.group)
                        .then(() => {
                            this.toastService.success(`Group <strong>${this.group.name}</strong> deleted`);
                            this.eventBus.emit(events.GROUP_DELETED, {
                                group: this.group
                            });
                        })
                        .catch(err => {
                            this.toastService.danger(`The group could not be deleted. ${err.data.message}`);
                        });
                });
        }
    }
};
