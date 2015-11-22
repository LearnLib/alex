/**
 * The class for the learn result widget
 * Use: <latest-learn-result-widget></latest-learn-result-widget>
 */
// @ngInject
class LatestLearnResultWidget {

    /**
     * Constructor
     * @param SessionService
     * @param LearnResultResource
     */
    constructor(SessionService, LearnResultResource) {

        /**
         * The latest learning result
         * @type {null|LearnResult}
         */
        this.result = null;

        /**
         * The project that is in the session
         * @type {Project}
         */
        this.project = SessionService.project.get();

        // get the latest learn result
        LearnResultResource.getAllFinal(this.project.id).then(results => {
            if (results.length > 0) {
                this.result = results[results.length - 1];
            }
        })
    }
}

const latestLearnResultWidget = {
    controller: LatestLearnResultWidget,
    controllerAs: 'vm',
    template: `
        <widget title="Latest learn result">
            <div class="text-muted" ng-if="!vm.result">
                <em>There are no learn results in the database</em>
            </div>
            <div ng-if="vm.result">
                <p>
                    The latest learning process started at
                    <strong ng-bind="::(vm.result.statistics.startDate | date : 'EEE, dd.MM.yyyy, HH:mm')"></strong> with EQ-oracle
                    <strong ng-bind="::(vm.result.configuration.eqOracle.type | formatEqOracle)"></strong> and the
                    <strong ng-bind="::(vm.result.configuration.algorithm | formatAlgorithm)"></strong> algorithm.
                </p>
                <a class="btn btn-xs btn-default" ui-sref="learn.results.compare({testNos: [vm.result.testNo]})">
                    <i class="fa fa-fw fa-eye"></i> View hypothesis
                </a>
                <a class="btn btn-xs btn-default" ui-sref="statistics.compare({testNos: [vm.result.testNo], mode: 'cumulated'})">
                    <i class="fa fa-fw fa-bar-chart-o"></i> View statistics
                </a>
            </div>
        </widget>
    `
};

export default latestLearnResultWidget;