/*
 * Copyright 2015 - 2021 TU Dortmund
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


import { Component, Input, OnInit } from '@angular/core';
import { LearnerSetup } from '../../entities/learner-setup';
import { SelectSymbolModalComponent } from '../modals/select-symbol-modal/select-symbol-modal.component';
import { AlphabetSymbol } from '../../entities/alphabet-symbol';
import { ParametrizedSymbol } from '../../entities/parametrized-symbol';
import { SymbolGroup } from '../../entities/symbol-group';
import { AppStoreService } from '../../services/app-store.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { LearningAlgorithmService } from '../../services/learning-algorithm.service';
import { learningAlgorithm } from '../../constants';
import { Selectable } from '../../utils/selectable';
import { ProjectEnvironment } from '../../entities/project-environment';
import { FormGroup } from '@angular/forms';
import { Project } from '../../entities/project';
import { SettingsApiService } from '../../services/api/settings-api.service';
import { SymbolGroupApiService } from '../../services/api/symbol-group-api.service';
import { LtlFormulaSuite } from '../../entities/ltl-formula-suite';
import { LtsFormulaApiService } from '../../services/api/lts-formula-api.service';
import { LtsFormulaSuiteApiService } from '../../services/api/lts-formula-suite-api.service';
import { TestApiService } from "../../services/api/test-api.service";
import { TestSelectTreeStore } from "../test-select-tree/test-select-tree.store";

@Component({
  selector: 'test-config-form',
  templateUrl: './test-config-form.component.html',
  styleUrls: ['./test-config-form.component.scss']
})
export class TestConfigFormComponent implements OnInit {

  @Input()
  config: any;

  testRoot: any;

  selectedEnvironment: any;

  constructor(public appStore: AppStoreService,
              private testApi: TestApiService,
              private store: TestSelectTreeStore) { }

  ngOnInit(): void {
    this.testApi.getRoot(this.appStore.project.id).subscribe(testRoot => {
      this.testRoot = testRoot;
    });
    this.selectEnvironment(this.appStore.project.getDefaultEnvironment());
  }

  selectEnvironment(env: any): void {
    this.selectedEnvironment = env;
    this.config.environmentId = env.id;
  }
}
