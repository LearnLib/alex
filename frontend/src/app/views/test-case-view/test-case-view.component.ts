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

import { TestCaseStep } from '../../entities/test-case-step';
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
import { TestConfigModalComponent } from '../tests-view/test-config-modal/test-config-modal.component';
import { TestConfigApiService } from '../../services/api/test-config-api.service';
import { TestExecutionConfig } from '../../entities/test-execution-config';
import { TestQueueItem, TestReportStatus } from '../../entities/test-status';
import { TestReportApiService } from '../../services/api/test-report-api.service';
import { BehaviorSubject, Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { ParametrizedSymbol } from '../../entities/parametrized-symbol';
import { TestSuite } from '../../entities/test-suite';
import { TestCase } from '../../entities/test-case';
import { handleLoadingIndicator } from '../../operators/handle-loading-indicator';

@Component({
  selector: 'test-case-view',
  templateUrl: './test-case-view.component.html'
})
export class TestCaseViewComponent implements OnInit, OnDestroy {

  /** The current test. */
  @Input()
  testCase: TestCase;

  readonly symbolGroupsLoading$ = new BehaviorSubject<boolean>(false);

  /** Map id -> symbol. */
  symbolMap: any;
  /** The config used for testing. */
  testConfig: any;

  groups: SymbolGroup[];

  root: TestSuite;

  currentTestRun: TestQueueItem;

  report: any;

  private pollHandle: number;

  constructor(private symbolGroupApi: SymbolGroupApiService,
              private appStore: AppStoreService,
              private toastService: ToastService,
              private testApi: TestApiService,
              private modalService: NgbModal,
              private testConfigApi: TestConfigApiService,
              private settingsApi: SettingsApiService,
              private testReportApi: TestReportApiService) {
    this.testCase = null;
    this.symbolMap = {};
  }

  ngOnInit(): void {
    window.addEventListener('keydown', this.keyDownHandler);

    this.symbolGroupApi.getAll(this.project.id)
      .pipe(handleLoadingIndicator(this.symbolGroupsLoading$))
      .subscribe({
        next: groups => {
          SymbolGroupUtils.getSymbols(groups).forEach(s => this.symbolMap[s.id] = s);
          this.groups = groups;
        },
        error: console.error
      });

    this.testApi.getRoot(this.appStore.project.id).subscribe(root => this.root = root);

    this.testConfigApi.getAll(this.project.id).subscribe((configs: any[]) => {
      const i = configs.findIndex(c => c.default);
      if (i > -1) {
        this.testConfig = configs[i];
        this.testConfig.environment = this.project.getEnvironmentById(this.testConfig.environment.id);
      } else {
        this.testConfig = new TestExecutionConfig();
        this.testConfig.environment = this.project.getDefaultEnvironment();
      }
    });
  }

  ngOnDestroy(): void {
    window.removeEventListener('keydown', this.keyDownHandler);
    window.clearTimeout(this.pollHandle);
  }

  /**
   * Save the state of the test case.
   */
  save(): void {
    this.saveTest().subscribe(
      () => this.toastService.success('The test case has been updated.'),
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

    this.saveTest().subscribe(
      () => {
        this.testConfig.tests = [this.testCase.id];

        this.testApi.executeMany(this.project.id, this.testConfig).subscribe(
          data => {
            this.currentTestRun = data;
            this.pollForResult();
          },
          res => {
            this.toastService.info('The test case could not be executed. ' + res.error.message);
          }
        );
      },
      res => this.toastService.danger('The test could not be executed. ' + res.error.message)
    );
  }

  openTestConfigModal(): void {
    const modalRef = this.modalService.open(TestConfigModalComponent);
    modalRef.componentInstance.configuration = JSON.parse(JSON.stringify(this.testConfig));
    modalRef.componentInstance.project = this.project;
    modalRef.result.then((config) => {
      this.testConfig = config;
      this.toastService.success(`The config has been saved for the moment.`);
    }).catch(() => {});
  }

  addSymbolStep(symbol: AlphabetSymbol): void {
    this.testCase.steps.push(TestCaseStep.fromSymbol(symbol));
  }

  getSymbolPath(symbol: AlphabetSymbol): string {
    return SymbolGroupUtils.getSymbolPath(this.groups, symbol);
  }

  private pollForResult(): void {
    if (this.pollHandle != null) {
      window.clearTimeout(this.pollHandle);
    }

    const f = () => {
      this.testReportApi.get(this.project.id, this.currentTestRun.report.id).subscribe(
        report => {
          this.report = report;
          if (this.report.status === TestReportStatus.PENDING || this.report.status === TestReportStatus.IN_PROGRESS) {
            this.pollHandle = window.setTimeout(() => f(), 3000);
          }
        }
      );
    };
    f();
  }

  private keyDownHandler = (e) => {
    if (e.ctrlKey && e.which === 83) {
      e.preventDefault();
      this.save();
      return false;
    }
  };

  private saveTest(): Observable<any> {
    const test = JSON.parse(JSON.stringify(this.testCase));
    return this.testApi.update(test).pipe(
      tap((updatedTestCase: any) => this.testCase = updatedTestCase)
    );
  }

  get result(): any {
    if (this.report == null || this.report.testResults.length === 0) {
      return null;
    } else {
      return this.report.testResults[0];
    }
  }

  get project(): Project {
    return this.appStore.project;
  }

  get allParametrizedSymbols(): ParametrizedSymbol[] {
    const ps = [];
    this.testCase.preSteps.forEach(s => ps.push(s.pSymbol));
    this.testCase.steps.map(s => ps.push(s.pSymbol));
    this.testCase.postSteps.map(s => ps.push(s.pSymbol));
    return ps;
  }

  get canExecute(): boolean {
    return TestExecutionConfig.isValid(this.testConfig) && this.testCase.steps.length > 0;
  }

  get casePath(): string {
    return TestCase.getTestPath(this.root, this.testCase);
  }
}
