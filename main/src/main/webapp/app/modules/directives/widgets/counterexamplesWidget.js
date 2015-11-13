import {events} from '../../constants';

const template = `
        <form class="form form-condensed" ng-submit="testAndAddCounterExample()">
            <p class="text-muted">
                <em>Click on the labels of the hypothesis to create a counterexample.</em>
            </p>
            <div class="list-group list-group-condensed" ng-sortable="{animation:150}">
                <div class="list-group-item counterexample-list-item" ng-repeat="io in counterExample">
                    <i class="fa fa-fw fa-close pull-right" ng-click="removeInputOutputAt($index)"></i>
                    <span class="label label-primary">{{io.input}}</span>
                    <span class="label" ng-class="io.output === 'OK' ? 'label-success' : 'label-danger'">
                        {{io.output}}
                    </span>
                </div>
            </div>
            <div ng-show="counterExample.length > 0">
                <button class="btn btn-default btn-sm btn-block">Add counterexample</button>
                <hr>
            </div>
        </form>

        <ul class="list-group">
            <li class="list-group-item" ng-repeat="ce in tmpCounterExamples">
                <span class="pull-right" ng-click="removeCounterExampleAt($index)">
                    <i class="fa fa-trash"></i>
                </span>
                <div class="clearfix" style="margin-right: 32px;">
                    <span class="label label-primary pull-left" style="margin: 0 3px 3px 0"
                          ng-repeat="c in ce" ng-bind="c.input">
                    </span>
                </div>
            </li>
        </ul>
    `;

/**
 * The directive for the content of the counterexample widget that is used to create and test counterexamples.
 * Should be included into a <widget></widget> directive for visual appeal.
 *
 * Attribute 'counterexamples' {array} should be the model where the created counterexamples are put into.
 *
 * Use: '<widget title="...">
 *          <counterexamples-widget counterexamples="..."></counterexamples-widget>
 *       </widget>'
 *
 * @param LearnerResource - The LearnerResource for communication with the Learner
 * @param ToastService - The ToastService
 * @param SymbolResource
 * @param $q - The angular $q service
 * @param EventBus
 * @returns {{scope: {counterexamples: string}, template: string, link: link}}
 */
// @ngInject
function counterexamplesWidget(LearnerResource, ToastService, SymbolResource, $q, EventBus) {
    return {
        scope: {
            counterexamples: '=',
            learnResult: '='
        },
        template: template,
        link: link
    };

    function link(scope) {

        let symbols = [];

        /**
         * The array of input output pairs of the shared counterexample
         * @type {Array}
         */
        scope.counterExample = [];

        /**
         * A list of counterexamples for editing purposes without manipulation the actual model
         * @type {Object[]}
         */
        scope.tmpCounterExamples = [];

        // update the model
        function renewCounterexamples() {
            scope.counterexamples = scope.tmpCounterExamples;
        }


        EventBus.on(events.HYPOTHESIS_LABEL_SELECTED, (evt, data) => {
            scope.counterExample.push({
                input: data.input,
                output: data.output
            })
        }, scope);

        /**
         * Removes a input output pair from the temporary counterexamples array.
         *
         * @param {number} i - The index of the pair to remove
         */
        scope.removeInputOutputAt = function (i) {
            scope.counterExample.splice(i, 1);
        };

        /**
         * Adds a new counterexample to the scope and the model
         */
        scope.testAndAddCounterExample = function () {
            testCounterExample()
                .then(function (counterexample) {
                    ToastService.success('The selected word is a counterexample');

                    for (var i = 0; i < counterexample.length; i++) {
                        scope.counterExample[i].output = counterexample[i];
                    }
                    scope.tmpCounterExamples.push(scope.counterExample);
                    renewCounterexamples();
                    init();
                })
                .catch(function () {
                    ToastService.danger('The word is not a counterexample');
                })
        };

        /**
         * Removes a counterexample from the temporary and the model
         *
         * @param {number} i - the index of the pair in the temporary list of counterexamples
         */
        scope.removeCounterExampleAt = function (i) {
            scope.tmpCounterExamples.splice(i, 1);
            renewCounterexamples();
        };

        /**
         * Tests if the entered counterexample really is one by sending it to the server for testing purposes.
         */
        function testCounterExample() {
            var resetSymbol = scope.learnResult.configuration.resetSymbol;
            var deferred = $q.defer();

            if (symbols.length === 0) {
                SymbolResource.getManyByIdRevisionPairs(scope.learnResult.project,
                    scope.learnResult.configuration.symbols)
                    .then(s => {
                        symbols = s;
                        test();
                    });
            } else {
                test();
            }

            function test() {
                var testSymbols = [];

                // find id/revision pairs of symbols from abbreviation in learnResult
                for (var i = 0; i < scope.counterExample.length; i++) {
                    for (var j = 0; j < symbols.length; j++) {
                        if (scope.counterExample[i].input === symbols[j].abbreviation) {
                            testSymbols.push(symbols[j].getIdRevisionPair());
                        }
                    }
                }

                LearnerResource.isCounterexample(scope.learnResult.project, resetSymbol, testSymbols)
                    .then(function (ce) {
                        var ceFound = false;
                        for (var i = 0; i < ce.length; i++) {
                            if (ce[i] !== scope.counterExample[i].output) {
                                ceFound = true;
                                break;
                            }
                        }
                        if (ceFound) {
                            deferred.resolve(ce);
                        } else {
                            deferred.reject();
                        }
                    })
            }

            return deferred.promise;
        }
    }
}

export default counterexamplesWidget;