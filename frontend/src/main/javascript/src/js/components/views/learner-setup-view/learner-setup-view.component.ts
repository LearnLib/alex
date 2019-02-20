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

import {AlphabetSymbol} from '../../../entities/alphabet-symbol';
import {LearnConfiguration} from '../../../entities/learner-configuration';
import {ParametrizedSymbol} from '../../../entities/parametrized-symbol';
import {SymbolGroupResource} from '../../../services/resources/symbol-group-resource.service';
import {ProjectService} from '../../../services/project.service';
import {LearnerResource} from '../../../services/resources/learner-resource.service';
import {ToastService} from '../../../services/toast.service';
import {SettingsResource} from '../../../services/resources/settings-resource.service';
import {SymbolGroup} from '../../../entities/symbol-group';
import {LearnResult} from '../../../entities/learner-result';
import {Project} from '../../../entities/project';
import {LearnResultResource} from '../../../services/resources/learner-result-resource.service';

/**
 * The controller that handles the preparation of a learn process. Lists all symbol groups and its visible symbols.
 */
class LearnerSetupViewComponent {

  /** All symbol groups that belong the the sessions project. */
  public groups: SymbolGroup[];

  /** The learn results of previous learn processes. */
  public learnResults: LearnResult[];

  /** The configuration that is send to the server for learning. */
  public learnConfiguration: LearnConfiguration;

  /** The latest learner result in the project. */
  public latestLearnerResult: LearnResult;

  public pSymbols: ParametrizedSymbol[];

  public pResetSymbol: ParametrizedSymbol;

  public pPostSymbol: ParametrizedSymbol;

  /**
   * Constructor.
   *
   * @param $state
   * @param symbolGroupResource
   * @param projectService
   * @param learnerResource
   * @param toastService
   * @param learnResultResource
   * @param settingsResource
   * @param $uibModal
   */
  /* @ngInject */
  constructor(private $state: any,
              private symbolGroupResource: SymbolGroupResource,
              private projectService: ProjectService,
              private learnerResource: LearnerResource,
              private toastService: ToastService,
              private learnResultResource: LearnResultResource,
              private settingsResource: SettingsResource,
              private $uibModal: any) {

    this.groups = [];
    this.learnResults = [];
    this.latestLearnerResult = null;
    this.pSymbols = [];
    this.pResetSymbol = null;
    this.pPostSymbol = null;

    this.learnConfiguration = new LearnConfiguration();
    this.learnConfiguration.urls = [this.project.getDefaultUrl()];

    settingsResource.getSupportedWebDrivers()
      .then(data => this.learnConfiguration.driverConfig.name = data.defaultWebDriver)
      .catch(console.error);

    // make sure that there isn't any other learn process active
    // redirect to the load screen in case there is an active one
    this.learnerResource.getStatus(this.project.id)
      .then(data => {
        if (data.active) {
          if (data.project === this.project.id) {
            this.toastService.info('There is an active learning process for this project.');
            this.$state.go('learnerStart', {projectId: this.project.id});
          } else {
            this.toastService.info('There is an active learning process for another project.');
          }
        } else {

          // load all symbols in case there isn't any active learning process
          this.symbolGroupResource.getAll(this.project.id, true)
            .then(groups => this.groups = groups)
            .catch(console.error);

          // load learn results so that their configuration can be reused
          this.learnResultResource.getAll(this.project.id)
            .then(learnResults => this.learnResults = learnResults)
            .catch(console.error);

          this.learnResultResource.getLatest(this.project.id)
            .then(latestLearnerResult => this.latestLearnerResult = latestLearnerResult)
            .catch(console.error);
        }
      })
      .catch(console.error);
  }

  /** @param config The config to use. */
  setLearnConfiguration(config): void {
    this.learnConfiguration = config;
  }

  /** @param symbol The symbol that will be used to reset the sul. */
  setResetSymbol(symbol: AlphabetSymbol): void {
    this.pResetSymbol = ParametrizedSymbol.fromSymbol(symbol);
  }

  setPostSymbol(symbol: AlphabetSymbol): void {
    this.pPostSymbol = ParametrizedSymbol.fromSymbol(symbol);
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
    if (this.pResetSymbol === null) {
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
        config.urls = this.learnConfiguration.urls.map(u => u.id);

        // start learning
        this.learnerResource.start(this.project.id, config)
          .then(() => {
            this.toastService.success('Learn process started successfully.');
            this.$state.go('learnerStart', {projectId: this.project.id});
          })
          .catch(error => {
            this.toastService.danger('<p><strong>Start learning failed</strong></p>' + error.data.message);
          });
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
  reuseConfigurationFromResult(result: LearnResult): void {
    this.learnConfiguration.algorithm = result.algorithm;
    this.learnConfiguration.eqOracle = result.steps[0].eqOracle;
    this.learnConfiguration.maxAmountOfStepsToLearn = result.maxAmountOfStepsToLearn;
    this.learnConfiguration.driverConfig = result.driverConfig;
    this.learnConfiguration.urls = result.urls;
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
    this.$uibModal.open({
      component: 'learnerSetupSettingsModal',
      resolve: {
        learnConfiguration: () => new LearnConfiguration(this.learnConfiguration)
      }
    }).result.then(config => this.learnConfiguration = config);
  }

  get project(): Project {
    return this.projectService.store.currentProject;
  }
}

export const learnerSetupViewComponent = {
  template: require('./learner-setup-view.component.html'),
  controllerAs: 'vm',
  controller: LearnerSetupViewComponent
};
