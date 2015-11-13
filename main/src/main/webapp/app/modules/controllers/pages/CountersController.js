import {_} from '../../libraries';

/**
 * The controller for the page that lists all counters of a project in a list. It is also possible to delete them.
 */
// @ngInject
class CountersController {

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
        this.project = SessionService.project.get();

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
        this.CounterResource.delete(this.project.id, counter.name)
            .then(() => {
                this.ToastService.success('Counter "' + counter.name + '" deleted');
                _.remove(this.counters, {name: counter.name});
            })
            .catch(response => {
                ToastService.danger('<p><strong>Deleting counter "' + counter.name + '" failed</strong></p>' + response.data.message);
            })
    }

    /**
     * Delete all selected counters from the server and on success from scope
     */
    deleteSelectedCounters () {
        if (this.selectedCounters.length > 0) {
            this.CounterResource.deleteSome(this.project.id, _.pluck(this.selectedCounters, 'name'))
                .then(() => {
                    this.ToastService.success('Counters deleted');
                    this.selectedCounters.forEach(counter => {
                        _.remove(this.counters, {name: counter.name});
                    })
                })
                .catch(response => {
                    ToastService.danger('<p><strong>Deleting counters failed</strong></p>' + response.data.message);
                })
        }
    }
}

export default CountersController;