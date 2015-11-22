const template = `
    <widget title="Learner status">
        <div class="alert alert-info no-margin-bottom" ng-if="!isActive && !hasFinished">
            The Learner is not active. <a ui-sref="learn.setup">Start learning</a> your application!
        </div>
        <div class="alert alert-info no-margin-bottom" ng-if="!isActive && hasFinished">
            The Learner is not active and created a model.
            <a ui-sref="learn.start">Refine it</a>,
            <a ui-sref="learn.results.compare({testNos: [result.testNo]})">have a look at it</a> or
            <a ui-sref="learn.setup">Start a new test!</a>
        </div>
        <div class="alert alert-warning no-margin-bottom clearfix" ng-if="isActive">
            The Learner is currently learning an application. <hr>
            <button class="btn btn-xs btn-warning pull-right" ng-click="abort()">Abort</button>
        </div>
    </widget>
`;

/**
 * The directive of the dashboard widget that displays the current status of the learner
 *
 * Use: <widget title="...">
 *          <learner-status-widget></learner-status-widget>
 *      </widget>
 *
 * @param LearnerResource - The LearnerResource
 * @param ToastService - The ToastService
 * @returns {{scope: {}, template: string, link: link}}
 */
// @ngInject
function learnerStatusWidget(LearnerResource, ToastService) {
    return {
        scope: {},
        template: template,
        link: link
    };

    function link(scope) {

        /**
         * Whether the learner is actively learning an application
         * @type {boolean}
         */
        scope.isActive = false;

        /**
         * Whether the learner has finished learning an application
         * @type {boolean}
         */
        scope.hasFinished = false;

        /**
         * The intermediate or final learning result
         * @type {null|LearnResult}
         */
        scope.result = null;

        LearnerResource.isActive()
            .then(function (data) {
                scope.isActive = data.active;
                if (!data.active) {
                    LearnerResource.getStatus()
                        .then(function (data) {
                            if (data !== null) {
                                scope.hasFinished = true;
                                scope.result = data;
                            }
                        });
                }
            });

        /**
         * Induces the Learner to stop learning after the current hypothesis model
         */
        scope.abort = function () {
            LearnerResource.stop().then(function () {
                ToastService.info('The Learner stops with the next hypothesis');
            })
        }
    }
}

export default learnerStatusWidget;