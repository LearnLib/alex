import _ from 'lodash';

/**
 * The controller for listing all final test results.
 */
// @ngInject
class LearnResultsController {

    /**
     * Constructor
     * @param $state
     * @param SessionService
     * @param LearnResultResource
     * @param PromptService
     * @param ToastService
     */
    constructor($state, SessionService, LearnResultResource, PromptService, ToastService) {
        this.$state = $state;
        this.PromptService = PromptService;
        this.ToastService = ToastService;
        this.LearnResultResource = LearnResultResource;

        /**
         * The project that is in the session
         * @type {Project}
         */
        this.project = SessionService.getProject();

        /**
         * All final test results of a project
         * @type {LearnResult[]}
         */
        this.results = [];

        /**
         * The test results the user selected
         * @type {LearnResult[]}
         */
        this.selectedResults = [];

        // get all final test results
        this.LearnResultResource.getAllFinal(this.project.id).then(results => {
            this.results = results;
        });
    }

    /**
     * Deletes a test result from the server after prompting the user for confirmation
     *
     * @param {LearnResult} result - The test result that should be deleted
     */
    deleteResult(result) {
        this.PromptService.confirm("Do you want to permanently delete this result? Changes cannot be undone.")
            .then(() => {
                this.LearnResultResource.remove(result)
                    .then(() => {
                        this.ToastService.success('Learn result for test <strong>' + result.testNo + '</strong> deleted');
                        _.remove(this.results, {testNo: result.testNo});
                    })
                    .catch(response => {
                        this.ToastService.danger('<p><strong>Result deletion failed</strong></p>' + response.data.message);
                    });
            });
    }

    /**
     * Deletes selected test results from the server after prompting the user for confirmation
     */
    deleteResults() {
        if (this.selectedResults.length > 0) {
            this.PromptService.confirm("Do you want to permanently delete theses results? Changes cannot be undone.")
                .then(() => {
                    this.LearnResultResource.remove(this.selectedResults)
                        .then(() => {
                            this.ToastService.success('Learn results deleted');
                            this.selectedResults.forEach(result => {
                                _.remove(this.results, {testNo: result.testNo});
                            });
                        })
                        .catch(response => {
                            this.ToastService.danger('<p><strong>Result deletion failed</strong></p>' + response.data.message);
                        });
                });
        } else {
            this.ToastService.info('You have to select a least one result');
        }
    }

    /**
     * Opens the learning result compare view with the selected results opened
     */
    openSelectedResults() {
        if (this.selectedResults.length > 0) {
            const testNos = _.pluck(this.selectedResults, 'testNo');
            this.$state.go('learn.results.compare', {testNos: testNos.join(',')});
        }
    }
}

export default LearnResultsController;
