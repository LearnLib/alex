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

import {AlphabetSymbol} from '../../../entities/alphabet-symbol';
import {LearnConfiguration} from '../../../entities/learner-configuration';
import {ParametrizedSymbol} from '../../../entities/parametrized-symbol';

/**
 * The controller that handles the preparation of a learn process. Lists all symbol groups and its visible symbols.
 */
class LearnerSetupViewComponent {

    /**
     * Constructor.
     *
     * @param $state
     * @param {SymbolGroupResource} SymbolGroupResource
     * @param {SessionService} SessionService
     * @param {LearnerResource} LearnerResource
     * @param {ToastService} ToastService
     * @param {LearnResultResource} LearnResultResource
     * @param {SettingsResource} SettingsResource
     */
    // @ngInject
    constructor($state, $scope, SymbolGroupResource, SessionService, LearnerResource, ToastService, LearnResultResource,
                SettingsResource, dragulaService) {
        this.$scope = $scope;
        this.$state = $state;
        this.LearnerResource = LearnerResource;
        this.ToastService = ToastService;
        this.dragulaService = dragulaService;

        /**
         * The project that is in the session.
         * @type {Project}
         */
        this.project = SessionService.getProject();

        /**
         * All symbol groups that belong the the sessions project.
         * @type {SymbolGroup[]}
         */
        this.groups = [];

        /**
         * The learn results of previous learn processes.
         * @type {LearnResult[]}
         */
        this.learnResults = [];

        /**
         * The configuration that is send to the server for learning.
         * @type {LearnConfiguration}
         */
        this.learnConfiguration = new LearnConfiguration();
        this.learnConfiguration.urls = [this.project.getDefaultUrl()];

        /**
         * The latest learner result in the project.
         * @type {?LearnResult}
         */
        this.latestLearnerResult = null;

        this.pSymbols = [];

        this.pResetSymbol = null;

        SettingsResource.getSupportedWebDrivers()
            .then(data => this.learnConfiguration.driverConfig.name = data.defaultWebDriver)
            .catch(console.error);

        // make sure that there isn't any other learn process active
        // redirect to the load screen in case there is an active one
        this.LearnerResource.getStatus(this.project.id)
            .then(data => {
                if (data.active) {
                    if (data.project === this.project.id) {
                        this.ToastService.info('There is an active learning process for this project.');
                        this.$state.go('learnerStart', {projectId: this.project.id});
                    } else {
                        this.ToastService.info('There is an active learning process for another project.');
                    }
                } else {

                    // load all symbols in case there isn't any active learning process
                    SymbolGroupResource.getAll(this.project.id, true)
                        .then(groups => this.groups = groups)
                        .catch(console.error);

                    // load learn results so that their configuration can be reused
                    LearnResultResource.getAll(this.project.id)
                        .then(learnResults => this.learnResults = learnResults)
                        .catch(console.error);

                    LearnResultResource.getLatest(this.project.id)
                        .then(latestLearnerResult => this.latestLearnerResult = latestLearnerResult)
                        .catch(console.error);
                }
            })
            .catch(console.error);
    }

    /** @param {LearnConfiguration} config - The config to use. */
    setLearnConfiguration(config) {
        this.learnConfiguration = config;
    }

    /** @param {AlphabetSymbol} symbol - The symbol that will be used to reset the sul. */
    setResetSymbol(symbol) {
        this.pResetSymbol = ParametrizedSymbol.fromSymbol(symbol);
    }

    handleSymbolSelected(symbol) {
        this.pSymbols.push(ParametrizedSymbol.fromSymbol(symbol));
    }

    handleSymbolGroupSelected(group) {
        group.symbols.forEach(s => this.pSymbols.push(ParametrizedSymbol.fromSymbol(s)));
    }

    /**
     * Starts the learning process if symbols are selected and a reset symbol is defined. Redirects to the
     * learning load screen on success.
     */
    startLearning() {
        if (this.pResetSymbol === null) {
            this.ToastService.danger('You <strong>must</strong> selected a reset symbol in order to start learning!');
        } else {

            if (this.pSymbols.length > 0) {
                const config = JSON.parse(JSON.stringify(this.learnConfiguration));
                config.symbols = JSON.parse(JSON.stringify(this.pSymbols));
                config.symbols.forEach(ps => ps.symbol = ps.symbol.id);
                config.resetSymbol = JSON.parse(JSON.stringify(this.pResetSymbol));
                config.resetSymbol.symbol = config.resetSymbol.symbol.id;
                config.urls = this.learnConfiguration.urls.map(u => u.id);

                // start learning
                this.LearnerResource.start(this.project.id, config)
                    .then(() => {
                        this.ToastService.success('Learn process started successfully.');
                        this.$state.go('learnerStart', {projectId: this.project.id});
                    })
                    .catch(error => {
                        this.ToastService.danger('<p><strong>Start learning failed</strong></p>' + error.data.message);
                    });
            } else {
                this.ToastService.danger('You <strong>must</strong> at least select one symbol to start learning');
            }
        }
    }

    /**
     * Reuse the properties of a previous learn result for the current one.
     *
     * @param {LearnResult} result - The learn result from that the configuration should be reused.
     */
    reuseConfigurationFromResult(result) {
        this.learnConfiguration.algorithm = result.algorithm;
        this.learnConfiguration.eqOracle = result.steps[0].eqOracle;
        this.learnConfiguration.maxAmountOfStepsToLearn = result.maxAmountOfStepsToLearn;
        this.learnConfiguration.driverConfig = result.driverConfig;
        this.learnConfiguration.urls = result.urls;
        this.learnConfiguration.resetSymbol = result.resetSymbol;
        this.learnConfiguration.resetSymbol.id = null;
        this.learnConfiguration.resetSymbol.parameterValues.forEach(v => v.id = null);
        this.learnConfiguration.symbols = result.symbols;
        this.learnConfiguration.symbols.forEach(s => {
            s.id = null;
            s.parameterValues.forEach(v => v.id = null);
        });

        this.pSymbols = this.learnConfiguration.symbols;
        this.pResetSymbol = this.learnConfiguration.resetSymbol;
    }
}

export const learnerSetupViewComponent = {
    template: require('./learner-setup-view.component.html'),
    controllerAs: 'vm',
    controller: LearnerSetupViewComponent
};
