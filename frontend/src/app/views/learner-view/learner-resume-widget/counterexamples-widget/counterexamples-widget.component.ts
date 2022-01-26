/*
 * Copyright 2015 - 2022 TU Dortmund
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

import { LearnerApiService } from '../../../../services/api/learner-api.service';
import { ToastService } from '../../../../services/toast.service';
import { SymbolApiService } from '../../../../services/api/symbol-api.service';
import { LearnerResult } from '../../../../entities/learner-result';
import { Component, EventEmitter, Input, OnDestroy, OnInit, Output } from '@angular/core';
import { LearnerViewStoreService } from '../../learner-view-store.service';
import { LearnerResultStepApiService } from '../../../../services/api/learner-result-step-api.service';
import { ProjectEnvironmentApiService } from '../../../../services/api/project-environment-api.service';
import { listEquals } from '../../../../utils/list-utils';
import { CdkDragDrop, moveItemInArray } from '@angular/cdk/drag-drop';

interface IOPair {
  input: string;
  output: string;
}

type Counterexample = Array<IOPair>;

/**
 * The directive for the content of the counterexample widget that is used to create and test counterexamples.
 */
@Component({
  selector: 'counterexamples-widget',
  templateUrl: './counterexamples-widget.component.html',
  styleUrls: ['./counterexamples-widget.component.scss']
})
export class CounterexamplesWidgetComponent implements OnInit {

  @Output()
  counterexamples = new EventEmitter<Counterexample[]>();

  @Input()
  result: LearnerResult;

  selectedEnvironmentId: number;

  /** The array of input output pairs of the shared counterexample. */
  counterexample: Counterexample = [];

  /** A list of counterexamples for editing purposes without manipulation the actual model. */
  tmpCounterexamples: Counterexample[] = [];

  loading = false;

  constructor(private learnerApi: LearnerApiService,
              private toastService: ToastService,
              private symbolApi: SymbolApiService,
              private projectEnvironmentApi: ProjectEnvironmentApiService,
              private learnerResultStepApi: LearnerResultStepApiService,
              private store: LearnerViewStoreService) {

    this.store.edgeSelected$.subscribe((data) => {
      this.counterexample.push({
        input: data.input,
        output: data.output
      });
    });
  }

  ngOnInit(): void {
    this.selectedEnvironmentId = this.result.setup.environments[0].id;
  }

  /**
   * Updates the model of the result.
   */
  renewCounterexamples(): void {
    this.counterexamples.emit(this.tmpCounterexamples);
  }

  /**
   * Removes a input output pair from the temporary counterexamples array.
   *
   * @param i - The index of the pair to remove.
   */
  removeInputOutputAt(i): void {
    this.counterexample.splice(i, 1);
  }

  /**
   * Adds a new counterexample to the scope and the model.
   */
  testAndAddCounterExample(): void {
    this.loading = true;
    this.testCounterExample()
      .then(counterexample => {
        this.toastService.success('The selected word is a counterexample');
        for (let i = 0; i < counterexample.length; i++) {
          this.counterexample[i].output = counterexample[i];
        }
        this.tmpCounterexamples.push(JSON.parse(JSON.stringify(this.counterexample)));
        this.renewCounterexamples();
      })
      .catch(() => {
        this.toastService.danger('The word is not a counterexample');
      }).finally(() => {
        this.loading = false;
      });
  }

  /**
   * Removes a counterexample from the temporary and the model.
   *
   * @param i the index of the pair in the temporary list of counterexamples.
   */
  removeCounterExampleAt(i: number): void {
    this.tmpCounterexamples.splice(i, 1);
    this.renewCounterexamples();
  }

  drop(event: CdkDragDrop<string[]>): void {
    moveItemInArray(this.counterexample, event.previousIndex, event.currentIndex);
  }

  /**
   * Tests if the entered counterexample really is one by sending it to the server for testing purposes.
   */
  testCounterExample(): Promise<any> {
    return new Promise((resolve, reject) => {
      const setup = this.result.setup;
      const testSymbols = [];

      const pSymbols = setup.symbols;
      const pSymbolNames = pSymbols.map(ps => ps.getAliasOrComputedName());

      for (const io of this.counterexample) {
        const j = pSymbolNames.findIndex(name => name === io.input);
        testSymbols.push(pSymbols[j]);
      }

      const preSymbol = JSON.parse(JSON.stringify(setup.preSymbol));
      preSymbol.symbol = {id: preSymbol.symbol.id};

      const symbols = JSON.parse(JSON.stringify(testSymbols));
      symbols.forEach(s => s.symbol = {id: s.symbol.id});

      let postSymbol;
      if (setup.postSymbol != null) {
        postSymbol = JSON.parse(JSON.stringify(setup.postSymbol));
        if (postSymbol != null) {
          postSymbol.symbol = {id: postSymbol.symbol.id};
        }
      }

      const input = testSymbols.map(ts => ts.getAliasOrComputedName());
      this.learnerResultStepApi.getHypothesisOutput(this.result.project, this.result.id, this.result.steps[this.result.steps.length - 1].id, input).subscribe(
        hypOutput => {

          const config = {
            preSymbol,
            symbols,
            postSymbol,
            driverConfig: setup.webDriver
          };

          this.projectEnvironmentApi.getOutput(this.result.project, this.selectedEnvironmentId, config).subscribe(
            sulOutput => {
              if (!listEquals(hypOutput, sulOutput)) {
                resolve(sulOutput);
              } else {
                reject();
              }
            },
            console.error
          );
        },
        console.error
      );
    });
  }
}
