/**
 * The directive for the dashboard widget that displays information about the latest learning result, if there
 * exists one.
 *
 * Use: <widget title="...">
 *          <latest-learn-result-widget></latest-learn-result-widget>
 *      </widget>
 *
 * @param SessionService - The SessionService
 * @param LearnResultResource - The LearnResult factory
 * @returns {{scope: {}, template: string, link: link}}
 */
// @ngInject
function latestLearnResultWidget(SessionService, LearnResultResource) {
    return {
        scope: {},
        template: `
             <div class="text-muted" ng-if="!result">
                <em>There are no learn results in the database</em>
            </div>
            <div ng-if="result">
                <p>
                    The latest learning process started at
                    <strong ng-bind="::(result.statistics.startDate | date : 'EEE, dd.MM.yyyy, HH:mm')"></strong> with EQ-oracle
                    <strong ng-bind="::(result.configuration.eqOracle.type | formatEqOracle)"></strong> and the
                    <strong ng-bind="::(result.configuration.algorithm | formatAlgorithm)"></strong> algorithm.
                </p>
                <a class="btn btn-xs btn-default" ui-sref="learn.results.compare({testNos: [result.testNo]})">Check it out</a>
            </div>
        `,
        link: link
    };

    function link(scope) {

        /**
         * The latest learning result
         * @type {null|LearnResult}
         */
        scope.result = null;

        // get the latest learn result
        LearnResultResource.getAllFinal(SessionService.project.get().id).then(results => {
            if (results.length > 0) {
                scope.result = results[results.length - 1];
            }
        })
    }
}

export default latestLearnResultWidget;