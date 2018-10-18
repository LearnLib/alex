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

import {webBrowser} from '../../../constants';
import {TestCaseStep} from '../../../entities/test-case-step';
import {DriverConfigService} from '../../../services/driver-config.service';
import {SymbolGroupUtils} from '../../../utils/symbol-group-utils';
import {IScope} from 'angular';
import {SymbolGroupResource} from '../../../services/resources/symbol-group-resource.service';
import {ProjectService} from '../../../services/project.service';
import {ToastService} from '../../../services/toast.service';
import {TestResource} from '../../../services/resources/test-resource.service';
import {SettingsResource} from '../../../services/resources/settings-resource.service';
import {SymbolGroup} from '../../../entities/symbol-group';
import {AlphabetSymbol} from '../../../entities/alphabet-symbol';
import {Project} from '../../../entities/project';

export const testCaseViewComponent = {
  template: require('./test-case-view.component.html'),
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

    /**
     * Constructor.
     *
     * @param $scope
     * @param $state
     * @param dragulaService
     * @param symbolGroupResource
     * @param projectService
     * @param toastService
     * @param testResource
     * @param $uibModal
     * @param settingsResource
     */
    // @ngInject
    constructor(private $scope: IScope,
                private $state: any,
                private dragulaService: any,
                private symbolGroupResource: SymbolGroupResource,
                private projectService: ProjectService,
                private toastService: ToastService,
                private testResource: TestResource,
                private $uibModal: any,
                private settingsResource: SettingsResource) {

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
        url: this.project.getDefaultUrl(),
        driverConfig: DriverConfigService.createFromName(webBrowser.HTML_UNIT),
        createReport: true,
      };

      this.symbolGroupResource.getAll(this.project.id, true)
        .then((groups) => {
          this.groups = groups;
          SymbolGroupUtils.getSymbols(this.groups).forEach(s => this.symbolMap[s.id] = s);
        })
        .catch(console.error);

      this.settingsResource.getSupportedWebDrivers()
        .then((data) => this.testConfig.driverConfig = DriverConfigService.createFromName(data.defaultWebDriver))
        .catch(console.error);

      this.dragulaService.options($scope, 'testSymbols', {
        removeOnSpill: false,
        mirrorContainer: document.createElement('div'),
        moves: (el, container, handle) => {
          return handle.classList.contains('handle');
        }
      });

      const keyDownHandler = (e) => {
        if (e.ctrlKey && e.which === 83) {
          e.preventDefault();
          this.save();
          return false;
        }
      };

      window.addEventListener('keydown', keyDownHandler);

      this.$scope.$on('$destroy', () => {
        this.dragulaService.destroy($scope, 'testSymbols');
        window.removeEventListener('keydown', keyDownHandler);
      });

      this.$scope.$on('testSymbols.drag', () => this.result.outputs = []);
    }

    $onInit(): void {
      this.testConfig.tests = [this.testCase];
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
      config.url = config.url.id;

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
      return this.projectService.store.currentProject;
    }
  }
};
