/**
 * The controller that handles the page for displaying multiple complete learn results in a slide show.
 */
// @ngInject
class ResultsCompareViewComponent {

    /**
     * Constructor
     * @param $timeout
     * @param $stateParams
     * @param SessionService
     * @param LearnResultResource
     * @param ErrorService
     */
    constructor($timeout, $stateParams, SessionService, LearnResultResource, ErrorService) {
        this.$timeout = $timeout;
        this.LearnResultResource = LearnResultResource;
        this.ErrorService = ErrorService;

        /**
         * The project that is in the session
         * @type {Project}
         */
        this.project = SessionService.getProject();

        /**
         * All final learn results from all tests that were made for a project
         * @type {LearnResult[]}
         */
        this.results = [];

        /**
         * The list of active panels where each panel contains a complete learn result set
         * @type {LearnResult[][]}
         */
        this.panels = [];

        /**
         * The list of layout settings for the current hypothesis that is shown in a panel
         * @type {Object[]}
         */
        this.layoutSettings = [];

        // load all final learn results of all test an then load the complete test results from the test numbers
        // that are passed from the url in the panels
        if (!$stateParams.testNos) {
            this.ErrorService.setErrorMessage("There are no test numbers defined in the URL");
        } else {
            this.LearnResultResource.getAllFinal(this.project.id).then(results => {
                this.results = results;
                this.loadComplete($stateParams.testNos);
            });
        }
    }

    /**
     * Loads a complete learn result set from a test number in the panel with a given index
     *
     * @param {String} testNos - The test numbers as concatenated string, separated by a ','
     * @param {number} index - The index of the panel the complete learn result should be displayed in
     */
    loadComplete(testNos, index) {
        this.LearnResultResource.getManyComplete(this.project.id, testNos)
            .then(completeResults => {
                completeResults.forEach(result => {
                    if (angular.isUndefined(index)) {
                        this.panels.push(result);
                    } else {
                        this.panels[index] = result;
                    }
                });
            })
            .catch(response => {
                this.ErrorService.setErrorMessage(response.data.message);
            });
    }

    /**
     * Loads a complete learn result set from a learn result in the panel with a given index
     *
     * @param {LearnResult} result - The learn result whose complete set should be loaded in a panel
     * @param {number} index - The index of the panel the complete set should be displayed in
     */
    fillPanel(result, index) {
        this.loadComplete(result.testNo + '', index);
    }

    /**
     * Adds a new empty panel
     */
    addPanel() {
        this.panels.push(null);
    }

    /**
     * Removes a panel by a given index
     * @param {number} index - The index of the panel to remove
     */
    closePanel(index) {
        this.panels[index] = null;
        this.panels.splice(index, 1);
    }
}

export const resultsCompareViewComponent = {
    controller: ResultsCompareViewComponent,
    controllerAs: 'vm',
    templateUrl: 'views/pages/results-compare.html'
};