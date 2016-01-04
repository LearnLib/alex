import _ from 'lodash';

/**
 * The controller for the page that lists all counters of a project in a list. It is also possible to delete them.
 */
// @ngInject
class CountersViewComponent {

    /**
     * Constructor
     * @param SessionService
     * @param CounterResource
     * @param ToastService
     */
    constructor(SessionService, CounterResource, ToastService) {
        this.CounterResource = CounterResource;
        this.ToastService = ToastService;

        /**
         * The project that is in the session
         * @type {Project}
         */
        this.project = SessionService.getProject();

        /**
         * The counters of the project
         * @type {Counter[]}
         */
        this.counters = [];

        /**
         * The selected counters objects
         * @type {Counter[]}
         */
        this.selectedCounters = [];

        // load all existing counters from the server
        this.CounterResource.getAll(this.project.id).then(counters => {
            this.counters = counters;
        });
    }


    /**
     * Delete a counter from the server and on success from scope
     *
     * @param {Counter} counter - The counter that should be deleted
     */
    deleteCounter(counter) {
        this.CounterResource.remove(this.project.id, counter)
            .then(() => {
                this.ToastService.success('Counter "' + counter.name + '" deleted');
                _.remove(this.counters, {name: counter.name});
            })
            .catch(response => {
                this.ToastService.danger('<p><strong>Deleting counter "' + counter.name + '" failed</strong></p>' + response.data.message);
            });
    }

    /**
     * Delete all selected counters from the server and on success from scope
     */
    deleteSelectedCounters() {
        if (this.selectedCounters.length > 0) {
            this.CounterResource.removeMany(this.project.id, this.selectedCounters)
                .then(() => {
                    this.ToastService.success('Counters deleted');
                    this.selectedCounters.forEach(counter => {
                        _.remove(this.counters, {name: counter.name});
                    });
                })
                .catch(response => {
                    this.ToastService.danger('<p><strong>Deleting counters failed</strong></p>' + response.data.message);
                });
        }
    }
}

export const countersViewComponent = {
    controller: CountersViewComponent,
    controllerAs: 'vm',
    templateUrl: 'views/pages/counters.html'
};