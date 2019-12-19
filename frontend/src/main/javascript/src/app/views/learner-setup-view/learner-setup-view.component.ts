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
import { LearnerConfiguration } from '../../entities/learner-configuration';
import { ParametrizedSymbol } from '../../entities/parametrized-symbol';
import { SymbolGroupApiService } from '../../services/api/symbol-group-api.service';
import { LearnerApiService } from '../../services/api/learner-api.service';
import { ToastService } from '../../services/toast.service';
import { SettingsApiService } from '../../services/api/settings-api.service';
import { SymbolGroup } from '../../entities/symbol-group';
import { LearnerResult, LearnerResultStatus } from '../../entities/learner-result';
import { Project } from '../../entities/project';
import { LearnerResultApiService } from '../../services/api/learner-result-api.service';
import { AppStoreService } from '../../services/app-store.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { SelectSymbolModalComponent } from '../../common/modals/select-symbol-modal/select-symbol-modal.component';
import { Component } from '@angular/core';
import { LearnerSettingsModalComponent } from './learner-settings-modal/learner-settings-modal.component';
import { reverse, takeRight } from 'lodash';
import { Router } from '@angular/router';
import { LearnerResultListModalComponent } from '../learner-results-compare-view/learner-result-list-modal/learner-result-list-modal.component';

/**
 * The controller that handles the preparation of a learn process. Lists all symbol groups and its visible symbols.
 */
@Component({
  selector: 'learner-setup-view',
  templateUrl: './learner-setup-view.component.html',
  styleUrls: ['./learner-setup-view.component.scss']
})
export class LearnerSetupViewComponent {

  /** All symbol groups that belong the the sessions project. */
  public groups: SymbolGroup[];

  /** The learn results of previous learn processes. */
  public learnerResults: LearnerResult[];

  /** The configuration that is send to the server for learning. */
  public learnerConfiguration: LearnerConfiguration;

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
    this.learnerResults = [];
    this.latestLearnerResult = null;
    this.pSymbols = [];
    this.pResetSymbol = null;
    this.pPostSymbol = null;

    this.learnerConfiguration = new LearnerConfiguration();
    this.learnerConfiguration.environments = [this.project.getDefaultEnvironment()];

    settingsApi.getSupportedWebDrivers().subscribe(
      data => this.learnerConfiguration.driverConfig.name = data.defaultWebDriver,
      console.error
    );

    // load all symbols in case there isn't any active learning process
    this.symbolGroupApi.getAll(this.project.id).subscribe(
      groups => this.groups = groups,
      console.error
    );

    // load learn results so that their configuration can be reused
    this.learnerResultApi.getAll(this.project.id).subscribe(
      learnerResults => this.learnerResults = learnerResults.filter(l => l.status === LearnerResultStatus.FINISHED),
      console.error
    );

    this.learnerResultApi.getLatest(this.project.id).subscribe(
      latestLearnerResult => this.latestLearnerResult = latestLearnerResult,
      console.error
    );
  }

   selectResetSymbol(): void {
    const modalRef = this.modalService.open(SelectSymbolModalComponent);
    modalRef.result.then((s: AlphabetSymbol) => {
      this.pResetSymbol = ParametrizedSymbol.fromSymbol(s);
    }).catch(() => {});
  }

  selectPostSymbol(): void {
    const modalRef = this.modalService.open(SelectSymbolModalComponent);
    modalRef.result.then((s: AlphabetSymbol) => {
      this.pPostSymbol = ParametrizedSymbol.fromSymbol(s);
    }).catch(() => {});
  }

  handleSymbolSelected(symbol: AlphabetSymbol): void {
    this.pSymbols.push(ParametrizedSymbol.fromSymbol(symbol));
  }

  handleSymbolGroupSelected(group: SymbolGroup): void {
    group.symbols.forEach(s => this.pSymbols.push(ParametrizedSymbol.fromSymbol(s)));
  }

  selectLearnerResult(): void {
    const modalRef = this.modalService.open(LearnerResultListModalComponent);
    modalRef.componentInstance.results = this.learnerResults;
    modalRef.componentInstance.allowForeignProjects = false;
    modalRef.componentInstance.allowFromFile = false;
    modalRef.result.then((lr: LearnerResult) => {
      this.reuseConfigurationFromResult(lr);
    }).catch(() => {});
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
        const config = JSON.parse(JSON.stringify(this.learnerConfiguration));
        config.symbols = JSON.parse(JSON.stringify(this.pSymbols));
        config.symbols.forEach(ps => ps.symbol = {id: ps.symbol.id});
        config.resetSymbol = JSON.parse(JSON.stringify(this.pResetSymbol));
        config.resetSymbol.symbol = {id: config.resetSymbol.symbol.id};
        if (this.pPostSymbol != null) {
          config.postSymbol = JSON.parse(JSON.stringify(this.pPostSymbol));
          config.postSymbol.symbol = {id: config.postSymbol.symbol.id};
        } else {
          config.postSymbol = null;
        }
        config.environments = this.learnerConfiguration.environments.map(u => u.id);

        // start learning
        this.learnerApi.start(this.project.id, config).subscribe(
          result => {
            this.toastService.success('Learner process started successfully.');
            this.router.navigate(['/app', 'projects', this.project.id, 'learner'], {
              queryParams: {
                testNo: result.testNo
              }
            });
          },
          res => {
            this.toastService.danger('<p><strong>Start learning failed</strong></p>' + res.error.message);
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
    this.learnerConfiguration.algorithm = result.algorithm;
    this.learnerConfiguration.eqOracle = result.steps[0].eqOracle;
    this.learnerConfiguration.maxAmountOfStepsToLearn = result.maxAmountOfStepsToLearn;
    this.learnerConfiguration.driverConfig = result.driverConfig;
    this.learnerConfiguration.environments = result.environments;
    this.learnerConfiguration.resetSymbol = result.resetSymbol;
    this.learnerConfiguration.resetSymbol.id = null;
    this.learnerConfiguration.resetSymbol.parameterValues.forEach(v => v.id = null);
    this.learnerConfiguration.resetSymbol.outputMappings.forEach(v => v.id = null);
    if (result.postSymbol != null) {
      this.learnerConfiguration.postSymbol = result.postSymbol;
      this.learnerConfiguration.postSymbol.id = null;
      this.learnerConfiguration.postSymbol.parameterValues.forEach(v => v.id = null);
      this.learnerConfiguration.postSymbol.outputMappings.forEach(v => v.id = null);
    } else {
      this.learnerConfiguration.postSymbol = null;
    }
    this.learnerConfiguration.symbols = result.symbols;
    this.learnerConfiguration.symbols.forEach(s => {
      s.id = null;
      s.parameterValues.forEach(v => v.id = null);
      s.outputMappings.forEach(v => v.id = null);
    });

    this.pSymbols = this.learnerConfiguration.symbols;
    this.pResetSymbol = this.learnerConfiguration.resetSymbol;
    this.pPostSymbol = this.learnerConfiguration.postSymbol;
  }

  openLearnerConfigurationModal(): void {
    const modalRef = this.modalService.open(LearnerSettingsModalComponent);
    modalRef.componentInstance.learnConfiguration = new LearnerConfiguration(this.learnerConfiguration);
    modalRef.result
      .then((config: LearnerConfiguration) => this.learnerConfiguration = config)
      .catch(() => {});
  }

  getFirstNLearnerResults(n: number): LearnerResult[] {
    n = Math.max(1, n);
    n = Math.min(this.learnerResults.length, n);
    return reverse(takeRight(this.learnerResults, n)) as LearnerResult[];
  }

  get project(): Project {
    return this.appStore.project;
  }

  get allParametrizedSymbols(): ParametrizedSymbol[] {
    const ps = [];
    if (this.pResetSymbol != null) {
      ps.push(this.pResetSymbol);
    }
    this.pSymbols.forEach(s => ps.push(s));
    if (this.pPostSymbol != null) {
      ps.push(this.pPostSymbol);
    }
    return ps;
  }
}
