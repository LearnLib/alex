import {events} from '../../constants';

/**
 * The directive for the content of the counterexample widget that is used to create and test counterexamples.
 * Should be included into a <widget></widget> directive for visual appeal.
 *
 * Attribute 'counterexamples' {array} should be the model where the created counterexamples are put into.
 *
 * Use: <counterexamples-widget counterexamples="..."></counterexamples-widget>
 */
// @ngInject
class CounterexamplesWidget {

    /**
     * Constructor
     * @param $scope
     * @param LearnerResource
     * @param ToastService
     * @param SymbolResource
     * @param $q
     * @param EventBus
     */
    constructor($scope, LearnerResource, ToastService, SymbolResource, $q, EventBus) {
        this.LearnerResource = LearnerResource;
        this.ToastService = ToastService;
        this.SymbolResource = SymbolResource;
        this.$q = $q;

        /**
         * The symbols
         * @type {Symbol[]}
         */
        this.symbols = [];

        /**
         * The array of input output pairs of the shared counterexample
         * @type {Array}
         */
        this.counterExample = [];

        /**
         * A list of counterexamples for editing purposes without manipulation the actual model
         * @type {Object[]}
         */
        this.tmpCounterExamples = [];

        // wait for a click on the hypothesis and add the io pair to the counterexample
        EventBus.on(events.HYPOTHESIS_LABEL_SELECTED, (evt, data) => {
            this.counterExample.push({
                input: data.input,
                output: data.output
            })
        }, $scope);
    }

    /** Updates the model of the result */
    renewCounterexamples() {
        this.counterexamples = this.tmpCounterExamples;
    }

    /**
     * Removes a input output pair from the temporary counterexamples array.
     * @param {number} i - The index of the pair to remove
     */
    removeInputOutputAt(i) {
        this.counterExample.splice(i, 1);
    }

    /**
     * Adds a new counterexample to the scope and the model
     */
    testAndAddCounterExample() {
        this.testCounterExample()
            .then(counterexample => {
                this.ToastService.success('The selected word is a counterexample');
                for (let i = 0; i < counterexample.length; i++) {
                    this.counterExample[i].output = counterexample[i];
                }
                this.tmpCounterExamples.push(this.counterExample);
                this.renewCounterexamples();
            })
            .catch(() => {
                this.ToastService.danger('The word is not a counterexample');
            })
    }

    /**
     * Removes a counterexample from the temporary and the model
     *
     * @param {number} i - the index of the pair in the temporary list of counterexamples
     */
    removeCounterExampleAt(i) {
        this.tmpCounterExamples.splice(i, 1);
        this.renewCounterexamples();
    }

    /**
     * Tests if the entered counterexample really is one by sending it to the server for testing purposes.
     */
    testCounterExample() {
        const deferred = this.$q.defer();

        // helper function to test the counterexample
        const test = () => {
            const testSymbols = [];

            // find id/revision pairs of symbols from abbreviation in learnResult
            for (let i = 0; i < this.counterExample.length; i++) {
                for (let j = 0; j < this.symbols.length; j++) {
                    if (this.counterExample[i].input === this.symbols[j].abbreviation) {
                        testSymbols.push(this.symbols[j].getIdRevisionPair());
                    }
                }
            }

            const resetSymbol = this.learnResult.configuration.resetSymbol;

            // actually test the counterexample
            this.LearnerResource.isCounterexample(this.learnResult.project, resetSymbol, testSymbols)
                .then(ce => {
                    let ceFound = false;
                    for (let i = 0; i < ce.length; i++) {
                        if (ce[i] !== this.counterExample[i].output) {
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
        };

        // fetch symbols only once and cache them
        if (this.symbols.length === 0) {
            this.SymbolResource.getManyByIdRevisionPairs(this.learnResult.project,
                this.learnResult.configuration.symbols).then(symbols => {
                this.symbols = symbols;
                test();
            });
        } else {
            test();
        }

        return deferred.promise;
    }
}

const counterexamplesWidget = {
    bindings: {
        counterexamples: '=',
        learnResult: '='
    },
    controller: CounterexamplesWidget,
    controllerAs: 'vm',
    template: `
        <widget title="Counterexamples">
            <form class="form form-condensed" ng-submit="vm.testAndAddCounterExample()">
                <p class="text-muted">
                    <em>Click on the labels of the hypothesis to create a counterexample.</em>
                </p>
                <div class="list-group list-group-condensed" ng-sortable="{animation:150}">
                    <div class="list-group-item counterexample-list-item" ng-repeat="io in vm.counterExample">
                        <i class="fa fa-fw fa-close pull-right" ng-click="vm.removeInputOutputAt($index)"></i>
                        <span class="label label-primary">{{io.input}}</span>
                        <span class="label" ng-class="io.output === 'OK' ? 'label-success' : 'label-danger'">
                            {{io.output}}
                        </span>
                    </div>
                </div>
                <div ng-show="vm.counterExample.length > 0">
                    <button class="btn btn-default btn-sm btn-block">Add counterexample</button>
                    <hr>
                </div>
            </form>
            <ul class="list-group">
                <li class="list-group-item" ng-repeat="ce in vm.tmpCounterExamples">
                    <span class="pull-right" ng-click="vm.removeCounterExampleAt($index)">
                        <i class="fa fa-trash"></i>
                    </span>
                    <div class="clearfix" style="margin-right: 32px;">
                        <span class="label label-primary pull-left" style="margin: 0 3px 3px 0"
                              ng-repeat="c in ce" ng-bind="c.input">
                        </span>
                    </div>
                </li>
            </ul>
        </widget>
    `
};

export default counterexamplesWidget;