/*
 * Copyright 2015 - 2019 TU Dortmund
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

import * as angular from 'angular';
import { IPromise, IQService, IScope } from 'angular';
import { events } from '../../../constants';
import { LearnerResource } from '../../../services/resources/learner-resource.service';
import { ToastService } from '../../../services/toast.service';
import { SymbolResource } from '../../../services/resources/symbol-resource.service';
import { EventBus } from '../../../services/eventbus.service';
import { LearnResult } from '../../../entities/learner-result';

/**
 * The directive for the content of the counterexample widget that is used to create and test counterexamples.
 */
export const counterexamplesWidgetComponent = {
  template: require('html-loader!./counterexamples-widget.component.html'),
  bindings: {
    counterexamples: '=',
    result: '='
  },
  controllerAs: 'vm',
  controller: class CounterexamplesWidgetComponent {

    public counterexamples: any[];

    public result: LearnResult;

    /** The array of input output pairs of the shared counterexample. */
    public counterExample: any[] = [];

    /** A list of counterexamples for editing purposes without manipulation the actual model. */
    public tmpCounterExamples: any[] = [];

    /**
     * Constructor.
     *
     * @param $scope
     * @param learnerResource
     * @param toastService
     * @param symbolResource
     * @param $q
     * @param eventBus
     * @param dragulaService
     */
    /* @ngInject */
    constructor(private $scope: IScope,
                private learnerResource: LearnerResource,
                private toastService: ToastService,
                private symbolResource: SymbolResource,
                private $q: IQService,
                private eventBus: EventBus,
                private dragulaService: any) {

      // wait for a click on the hypothesis and add the io pair to the counterexample
      this.eventBus.on(events.HYPOTHESIS_LABEL_SELECTED, (evt, data) => {
        this.counterExample.push({
          input: data.input,
          output: data.output
        });
      }, this.$scope);

      this.dragulaService.options($scope, 'ceList', {
        removeOnSpill: false
      });

      this.$scope.$on('$destroy', () => this.dragulaService.destroy(this.$scope, 'ceList'));
    }

    /**
     * Updates the model of the result.
     */
    renewCounterexamples(): void {
      this.counterexamples = this.tmpCounterExamples;
    }

    /**
     * Removes a input output pair from the temporary counterexamples array.
     *
     * @param {number} i - The index of the pair to remove.
     */
    removeInputOutputAt(i): void {
      this.counterExample.splice(i, 1);
    }

    /**
     * Adds a new counterexample to the scope and the model.
     */
    testAndAddCounterExample(): void {
      this.testCounterExample()
        .then(counterexample => {
          this.toastService.success('The selected word is a counterexample');
          for (let i = 0; i < counterexample.length; i++) {
            this.counterExample[i].output = counterexample[i].output;
          }
          this.tmpCounterExamples.push(angular.copy(this.counterExample));
          this.renewCounterexamples();
        })
        .catch(() => {
          this.toastService.danger('The word is not a counterexample');
        });
    }

    /**
     * Removes a counterexample from the temporary and the model.
     *
     * @param i the index of the pair in the temporary list of counterexamples.
     */
    removeCounterExampleAt(i: number): void {
      this.tmpCounterExamples.splice(i, 1);
      this.renewCounterexamples();
    }

    /**
     * Tests if the entered counterexample really is one by sending it to the server for testing purposes.
     */
    testCounterExample(): IPromise<any> {
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
        resetSymbol.symbol = {id: resetSymbol.symbol.id};

        const symbols = JSON.parse(JSON.stringify(testSymbols));
        symbols.forEach(s => s.symbol = {id: s.symbol.id});

        const postSymbol = JSON.parse(JSON.stringify(this.result.postSymbol));
        if (postSymbol != null) {
          postSymbol.symbol = {id: postSymbol.symbol.id};
        }

        this.learnerResource.readOutputs(this.result.project, {
          symbols: {resetSymbol, symbols, postSymbol},
          driverConfig: this.result.driverConfig
        }).then(ce => {
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
};
