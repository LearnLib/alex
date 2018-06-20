/*
 * Copyright 2018 TU Dortmund
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

import {events} from '../../../constants';

/**
 * The directive for the content of the counterexample widget that is used to create and test counterexamples.
 * Should be included into a <widget></widget> directive for visual appeal.
 *
 * Attribute 'counterexamples' {array} should be the model where the created counterexamples are put into.
 */
class CounterexamplesWidgetComponent {

    /**
     * Constructor.
     *
     * @param $scope
     * @param {LearnerResource} LearnerResource
     * @param {ToastService} ToastService
     * @param {SymbolResource} SymbolResource
     * @param $q
     * @param {EventBus} EventBus
     * @param dragulaService
     */
    // @ngInject
    constructor($scope, LearnerResource, ToastService, SymbolResource, $q, EventBus, dragulaService) {
        this.LearnerResource = LearnerResource;
        this.ToastService = ToastService;
        this.SymbolResource = SymbolResource;
        this.$q = $q;

        /**
         * The array of input output pairs of the shared counterexample.
         * @type {Array}
         */
        this.counterExample = [];

        /**
         * A list of counterexamples for editing purposes without manipulation the actual model.
         * @type {Object[]}
         */
        this.tmpCounterExamples = [];

        // wait for a click on the hypothesis and add the io pair to the counterexample
        EventBus.on(events.HYPOTHESIS_LABEL_SELECTED, (evt, data) => {
            this.counterExample.push({
                input: data.input,
                output: data.output
            });
        }, $scope);

        dragulaService.options($scope, 'ceList', {
            removeOnSpill: false
        });

        $scope.$on('$destroy', () => dragulaService.destroy($scope, 'ceList'));
    }

    /**
     * Updates the model of the result.
     */
    renewCounterexamples() {
        this.counterexamples = this.tmpCounterExamples;
    }

    /**
     * Removes a input output pair from the temporary counterexamples array.
     *
     * @param {number} i - The index of the pair to remove.
     */
    removeInputOutputAt(i) {
        this.counterExample.splice(i, 1);
    }

    /**
     * Adds a new counterexample to the scope and the model.
     */
    testAndAddCounterExample() {
        this.testCounterExample()
            .then(counterexample => {
                this.ToastService.success('The selected word is a counterexample');
                for (let i = 0; i < counterexample.length; i++) {
                    this.counterExample[i].output = counterexample[i].output;
                }
                this.tmpCounterExamples.push(angular.copy(this.counterExample));
                this.renewCounterexamples();
            })
            .catch(() => {
                this.ToastService.danger('The word is not a counterexample');
            });
    }

    /**
     * Removes a counterexample from the temporary and the model.
     *
     * @param {number} i - the index of the pair in the temporary list of counterexamples.
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

            const pSymbols = this.result.symbols;
            const pSymbolNames = pSymbols.map(ps => ps.getComputedName());

            for (let i = 0; i < this.counterExample.length; i++) {
                const j = pSymbolNames.findIndex(name => name === this.counterExample[i].input);
                testSymbols.push(pSymbols[j]);
            }

            const resetSymbol = JSON.parse(JSON.stringify(this.result.resetSymbol));
            resetSymbol.symbol = resetSymbol.symbol.id;

            const symbols = JSON.parse(JSON.stringify(testSymbols));
            symbols.forEach(s => s.symbol = s.symbol.id);

            // actually test the counterexample
            this.LearnerResource.readOutputs(this.result.project, {
                symbols: {resetSymbol, symbols},
                driverConfig: this.result.driverConfig
            }).then(ce => {
                ce.shift();
                let ceFound = false;
                for (let i = 0; i < ce.length; i++) {
                    if (ce[i].output !== this.counterExample[i].output) {
                        ceFound = true;
                        break;
                    }
                }
                if (ceFound) {
                    deferred.resolve(ce);
                } else {
                    deferred.reject();
                }
            }).catch(console.error);
        };

        test();

        return deferred.promise;
    }
}

export const counterexamplesWidgetComponent = {
    template: require('./counterexamples-widget.component.html'),
    bindings: {
        counterexamples: '=',
        result: '='
    },
    controller: CounterexamplesWidgetComponent,
    controllerAs: 'vm'
};
