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

import { webBrowser } from '../../constants';
import { TestCaseStep } from '../../entities/test-case-step';
import { DriverConfigService } from '../../services/driver-config.service';
import { SymbolGroupUtils } from '../../utils/symbol-group-utils';
import { SymbolGroupApiService } from '../../services/api/symbol-group-api.service';
import { ToastService } from '../../services/toast.service';
import { TestApiService } from '../../services/api/test-api.service';
import { SettingsApiService } from '../../services/api/settings-api.service';
import { SymbolGroup } from '../../entities/symbol-group';
import { AlphabetSymbol } from '../../entities/alphabet-symbol';
import { Project } from '../../entities/project';
import { AppStoreService } from '../../services/app-store.service';
import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ExecutionResultModalComponent } from '../../common/modals/execution-result-modal/execution-result-modal.component';
import { TestConfigModalComponent } from '../tests-view/test-config-modal/test-config-modal.component';
import { TestConfigApiService } from '../../services/api/test-config-api.service';

@Component({
  selector: 'test-case-view',
  templateUrl: './test-case-view.component.html'
})
export class TestCaseViewComponent implements OnInit, OnDestroy {

  /** The current test. */
  @Input()
  testCase: any;
  /** The test result. */
  result: any;
  /** The test report. */
  report: any;
  /** Map id -> symbol. */
  symbolMap: any;
  /** If testing is in progress. */
  active: boolean;
  /** Display options */
  options: any;
  /** The config used for testing. */
  testConfig: any;
  groups: SymbolGroup[];

  constructor(private symbolGroupApi: SymbolGroupApiService,
              private appStore: AppStoreService,
              private toastService: ToastService,
              private testApi: TestApiService,
              private modalService: NgbModal,
              private testConfigApi: TestConfigApiService,
              private settingsApi: SettingsApiService) {

    this.testCase = null;
    this.result = null;
    this.report = null;
    this.symbolMap = {};
    this.active = false;

    this.options = {
      showSymbolOutputs: false
    };
  }

  get project(): Project {
    return this.appStore.project;
  }

  ngOnInit(): void {
    window.addEventListener('keydown', this.keyDownHandler);

    this.testConfig = {
      tests: [this.testCase],
      environment: this.project.getDefaultEnvironment(),
      driverConfig: DriverConfigService.createFromName(webBrowser.HTML_UNIT),
      createReport: true
    };

    this.testConfigApi.getAll(this.project.id).subscribe((configs: any[]) => {
      const i = configs.findIndex(c => c.default);
      if (i > -1) {
        this.testConfig = configs[i];
        this.testConfig.environment = this.project.getEnvironmentById(this.testConfig.environment);
      }
    });

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
  }

  ngOnDestroy(): void {
    window.removeEventListener('keydown', this.keyDownHandler);
  }

  showResultDetails(result: any): void {
    const modalRef = this.modalService.open(ExecutionResultModalComponent);
    modalRef.componentInstance.result = result;
  }

  /**
   * Save the state of the test case.
   */
  save(): void {
    const test = JSON.parse(JSON.stringify(this.testCase));
    this.testApi.update(test).subscribe(
      updatedTestCase => {
        this.toastService.success('The test case has been updated.');
        this.testCase = updatedTestCase;
      },
      res => this.toastService.danger('The test case could not be updated. ' + res.error.message)
    );
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
    this.testApi.execute(this.testCase, config).subscribe(
      data => {
        this.report = data;
        this.result = data.testResults[0];
        this.active = false;
      },
      res => {
        this.toastService.info('The test case could not be executed. ' + res.error.message);
        this.active = false;
      }
    );
  }

  openTestConfigModal(): void {
    const modalRef = this.modalService.open(TestConfigModalComponent);
    modalRef.componentInstance.configuration = JSON.parse(JSON.stringify(this.testConfig));
    modalRef.componentInstance.project = this.project;
    modalRef.result.then(data => {
      this.toastService.success('The settings have been updated.');
      this.testConfig = data;
    }).catch(() => {});
  }

  addSymbolStep(symbol: AlphabetSymbol): void {
    this.testCase.steps.push(TestCaseStep.fromSymbol(symbol));
  }

  private keyDownHandler = (e) => {
    if (e.ctrlKey && e.which === 83) {
      e.preventDefault();
      this.save();
      return false;
    }
  };
}
