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

import { AlphabetSymbol } from '../../entities/alphabet-symbol';
import { LearnConfiguration } from '../../entities/learner-configuration';
import { ParametrizedSymbol } from '../../entities/parametrized-symbol';
import { SymbolGroupApiService } from '../../services/api/symbol-group-api.service';
import { LearnerApiService } from '../../services/api/learner-api.service';
import { ToastService } from '../../services/toast.service';
import { SettingsApiService } from '../../services/api/settings-api.service';
import { SymbolGroup } from '../../entities/symbol-group';
import { LearnerResult } from '../../entities/learner-result';
import { Project } from '../../entities/project';
import { LearnerResultApiService } from '../../services/api/learner-result-api.service';
import { AppStoreService } from '../../services/app-store.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { SelectSymbolModalComponent } from '../../common/modals/select-symbol-modal/select-symbol-modal.component';
import { Component } from '@angular/core';
import { LearnerSettingsModalComponent } from './learner-settings-modal/learner-settings-modal.component';
import { take } from 'lodash';
import { Router } from '@angular/router';

/**
 * The controller that handles the preparation of a learn process. Lists all symbol groups and its visible symbols.
 */
@Component({
  selector: 'learner-setup-view',
  templateUrl: './learner-setup-view.component.html'
})
export class LearnerSetupViewComponent {

  /** All symbol groups that belong the the sessions project. */
  public groups: SymbolGroup[];

  /** The learn results of previous learn processes. */
  public learnResults: LearnerResult[];

  /** The configuration that is send to the server for learning. */
  public learnConfiguration: LearnConfiguration;

  /** The latest learner result in the project. */
  public latestLearnerResult: LearnerResult;

  public pSymbols: ParametrizedSymbol[];

  public pResetSymbol: ParametrizedSymbol;

  public pPostSymbol: ParametrizedSymbol;

  constructor(private symbolGroupApi: SymbolGroupApiService,
              private appStore: AppStoreService,
              private learnerApi: LearnerApiService,
              private toastService: ToastService,
              private learnerResultApi: LearnerResultApiService,
              private settingsApi: SettingsApiService,
              private modalService: NgbModal,
              private router: Router) {

    this.groups = [];
    this.learnResults = [];
    this.latestLearnerResult = null;
    this.pSymbols = [];
    this.pResetSymbol = null;
    this.pPostSymbol = null;

    this.learnConfiguration = new LearnConfiguration();
    this.learnConfiguration.environments = [this.project.getDefaultEnvironment()];

    settingsApi.getSupportedWebDrivers().subscribe(
      data => this.learnConfiguration.driverConfig.name = data.defaultWebDriver,
      console.error
    );

    // make sure that there isn't any other learn process active
    // redirect to the load screen in case there is an active one
    this.learnerApi.getStatus(this.project.id).subscribe(
      data => {
        if (data.active) {
          if (data.project === this.project.id) {
            this.toastService.info('There is an active learning process for this project.');
            this.router.navigate(['/app', 'projects', this.project.id, 'learner', 'learn']);
          } else {
            this.toastService.info('There is an active learning process for another project.');
          }
        } else {

          // load all symbols in case there isn't any active learning process
          this.symbolGroupApi.getAll(this.project.id).subscribe(
            groups => this.groups = groups,
            console.error
          );

          // load learn results so that their configuration can be reused
          this.learnerResultApi.getAll(this.project.id).subscribe(
            learnResults => this.learnResults = learnResults,
            console.error
          );

          this.learnerResultApi.getLatest(this.project.id).subscribe(
            latestLearnerResult => this.latestLearnerResult = latestLearnerResult,
            console.error
          );
        }
      },
      console.error
    );
  }

  get project(): Project {
    return this.appStore.project;
  }

  /** @param config The config to use. */
  setLearnConfiguration(config): void {
    this.learnConfiguration = config;
  }

  /** @param symbol The symbol that will be used to reset the sul. */
  selectResetSymbol(): void {
    const modalRef = this.modalService.open(SelectSymbolModalComponent);
    modalRef.result.then((s: AlphabetSymbol) => {
      this.pResetSymbol = ParametrizedSymbol.fromSymbol(s);
    });
  }

  selectPostSymbol(): void {
    const modalRef = this.modalService.open(SelectSymbolModalComponent);
    modalRef.result.then((s: AlphabetSymbol) => {
      this.pPostSymbol = ParametrizedSymbol.fromSymbol(s);
    });
  }

  handleSymbolSelected(symbol: AlphabetSymbol): void {
    this.pSymbols.push(ParametrizedSymbol.fromSymbol(symbol));
  }

  handleSymbolGroupSelected(group: SymbolGroup): void {
    group.symbols.forEach(s => this.pSymbols.push(ParametrizedSymbol.fromSymbol(s)));
  }

  /**
   * Starts the learning process if symbols are selected and a reset symbol is defined. Redirects to the
   * learning load screen on success.
   */
  startLearning(): void {
    if (this.pResetSymbol == null) {
      this.toastService.danger('You <strong>must</strong> selected a reset symbol in order to start learning!');
    } else {

      if (this.pSymbols.length > 0) {
        const config = JSON.parse(JSON.stringify(this.learnConfiguration));
        config.symbols = JSON.parse(JSON.stringify(this.pSymbols));
        config.symbols.forEach(ps => ps.symbol = {id: ps.symbol.id});
        config.resetSymbol = JSON.parse(JSON.stringify(this.pResetSymbol));
        config.resetSymbol.symbol = {id: config.resetSymbol.symbol.id};
        if (this.pPostSymbol != null) {
          config.postSymbol = JSON.parse(JSON.stringify(this.pPostSymbol));
          config.postSymbol.symbol = {id: config.postSymbol.symbol.id};
        }
        config.environments = this.learnConfiguration.environments.map(u => u.id);

        // start learning
        this.learnerApi.start(this.project.id, config).subscribe(
          () => {
            this.toastService.success('Learn process started successfully.');
            this.router.navigate(['/app', 'projects', this.project.id, 'learner', 'learn']);
          },
          error => {
            this.toastService.danger('<p><strong>Start learning failed</strong></p>' + error.data.message);
          }
        );
      } else {
        this.toastService.danger('You <strong>must</strong> at least select one symbol to start learning');
      }
    }
  }

  /**
   * Reuse the properties of a previous learn result for the current one.
   *
   * @param result The learn result from that the configuration should be reused.
   */
  reuseConfigurationFromResult(result: LearnerResult): void {
    this.learnConfiguration.algorithm = result.algorithm;
    this.learnConfiguration.eqOracle = result.steps[0].eqOracle;
    this.learnConfiguration.maxAmountOfStepsToLearn = result.maxAmountOfStepsToLearn;
    this.learnConfiguration.driverConfig = result.driverConfig;
    this.learnConfiguration.environments = result.environments;
    this.learnConfiguration.resetSymbol = result.resetSymbol;
    this.learnConfiguration.resetSymbol.id = null;
    this.learnConfiguration.resetSymbol.parameterValues.forEach(v => v.id = null);
    if (result.postSymbol != null) {
      this.learnConfiguration.postSymbol = result.postSymbol;
      this.learnConfiguration.postSymbol.id = null;
      this.learnConfiguration.postSymbol.parameterValues.forEach(v => v.id = null);
    }
    this.learnConfiguration.symbols = result.symbols;
    this.learnConfiguration.symbols.forEach(s => {
      s.id = null;
      s.parameterValues.forEach(v => v.id = null);
    });

    this.pSymbols = this.learnConfiguration.symbols;
    this.pResetSymbol = this.learnConfiguration.resetSymbol;
    this.pPostSymbol = this.learnConfiguration.postSymbol;
  }

  openLearnerConfigurationModal(): void {
    const modalRef = this.modalService.open(LearnerSettingsModalComponent);
    modalRef.componentInstance.learnConfiguration = new LearnConfiguration(this.learnConfiguration);
    modalRef.result.then((config: LearnConfiguration) => this.learnConfiguration = config);
  }

  getFirstNLearnerResults(n: number): LearnerResult[] {
    n = Math.max(1, n);
    n = Math.min(this.learnResults.length, n);
    return take(this.learnResults, n);
  }
}
