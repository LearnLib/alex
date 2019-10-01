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

import { webBrowser } from '../../../constants';
import { TestCaseStep } from '../../../entities/test-case-step';
import { DriverConfigService } from '../../../services/driver-config.service';
import { SymbolGroupUtils } from '../../../utils/symbol-group-utils';
import { IScope } from 'angular';
import { SymbolGroupApiService } from '../../../services/resources/symbol-group-api.service';
import { ToastService } from '../../../services/toast.service';
import { TestResource } from '../../../services/resources/test-resource.service';
import { SettingsApiService } from '../../../services/resources/settings-api.service';
import { SymbolGroup } from '../../../entities/symbol-group';
import { AlphabetSymbol } from '../../../entities/alphabet-symbol';
import { Project } from '../../../entities/project';
import { AppStoreService } from '../../../services/app-store.service';

export const testCaseViewComponent = {
  template: require('html-loader!./test-case-view.component.html'),
  bindings: {
    testCase: '='
  },
  controllerAs: 'vm',

  /**
   * The controller of the view.
   */
  controller: class TestCaseViewComponent {

    /** The current test. */
    public testCase: any;

    /** The test result. */
    public result: any;

    /** The test report. */
    public report: any;

    /** Map id -> symbol. */
    public symbolMap: any;

    /** If testing is in progress. */
    public active: boolean;

    /** Display options */
    public options: any;

    /** The config used for testing. */
    public testConfig: any;

    public groups: SymbolGroup[];

    /* @ngInject */
    constructor(private $scope: IScope,
                private symbolGroupApi: SymbolGroupApiService,
                private appStore: AppStoreService,
                private toastService: ToastService,
                private testResource: TestResource,
                private $uibModal: any,
                private settingsApi: SettingsApiService) {

      this.testCase = null;
      this.result = null;
      this.report = null;
      this.symbolMap = {};
      this.active = false;

      this.options = {
        showSymbolOutputs: false
      };

      this.testConfig = {
        tests: [],
        environment: this.project.getDefaultEnvironment(),
        driverConfig: DriverConfigService.createFromName(webBrowser.HTML_UNIT),
        createReport: true,
      };

      this.symbolGroupApi.getAll(this.project.id).subscribe(
        groups => {
          SymbolGroupUtils.getSymbols(groups).forEach(s => this.symbolMap[s.id] = s);
          this.groups = groups;
        },
        console.error
      );

      this.settingsApi.getSupportedWebDrivers().subscribe(
        data => this.testConfig.driverConfig = DriverConfigService.createFromName(data.defaultWebDriver),
        console.error
      );

      const keyDownHandler = (e) => {
        if (e.ctrlKey && e.which === 83) {
          e.preventDefault();
          this.save();
          return false;
        }
      };

      window.addEventListener('keydown', keyDownHandler);

      this.$scope.$on('$destroy', () => {
        window.removeEventListener('keydown', keyDownHandler);
      });
    }

    $onInit(): void {
      this.testConfig.tests = [this.testCase];
    }

    showResultDetails(result: any): void {
      this.$uibModal.open({
        component: 'executionResultModal',
        resolve: {
          result: () => result,
        }
      });
    }

    /**
     * Save the state of the test case.
     */
    save(): void {
      const test = JSON.parse(JSON.stringify(this.testCase));
      this.testResource.update(test)
        .then(updatedTestCase => {
          this.toastService.success('The test case has been updated.');
          this.testCase = updatedTestCase;
        })
        .catch((err) => this.toastService.danger('The test case could not be updated. ' + err.data.message));
    }

    /**
     * Execute the test case.
     */
    execute(): void {
      if (!this.testCase.steps.length) {
        this.toastService.info('You have to create at least one symbol.');
        return;
      }

      const config = JSON.parse(JSON.stringify(this.testConfig));
      config.tests = [this.testCase.id];
      config.environment = config.environment.id;

      this.result = null;
      this.active = true;
      this.testResource.execute(this.testCase, config)
        .then(data => {
          this.report = data;
          this.result = data.testResults[0];
          this.active = false;
        })
        .catch((err) => {
          this.toastService.info('The test case could not be executed. ' + err.data.message);
          this.active = false;
        });
    }

    openTestConfigModal(): void {
      this.$uibModal.open({
        component: 'testConfigModal',
        resolve: {
          configuration: () => JSON.parse(JSON.stringify(this.testConfig)),
          project: () => this.project
        }
      }).result.then(data => {
        this.toastService.success('The settings have been updated.');
        this.testConfig = data;
      });
    }

    addSymbolStep(symbol: AlphabetSymbol): void {
      this.testCase.steps.push(TestCaseStep.fromSymbol(symbol));
    }

    get project(): Project {
      return this.appStore.project;
    }
  }
};
