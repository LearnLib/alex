/*
 * Copyright 2015 - 2020 TU Dortmund
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

@Component({
  selector: 'learner-setup-form',
  templateUrl: './learner-setup-form.component.html',
  styleUrls: ['./learner-setup-form.component.scss']
})
export class LearnerSetupFormComponent implements OnInit {

  /** The constants for learnAlgorithm names. */
  learningAlgorithms: any = learningAlgorithm;

  @Input()
  setup: LearnerSetup;

  groups: SymbolGroup[] = [];
  selectedLearningAlgorithm: string = learningAlgorithm.TTT;
  formulaSuites: LtlFormulaSuite[] = [];
  selectedEnvironments = new Selectable<ProjectEnvironment, number>(e => e.id);
  selectedFormulaSuites = new Selectable<LtlFormulaSuite, number>(e => e.id);
  form = new FormGroup({});

  constructor(private appStore: AppStoreService,
              private modalService: NgbModal,
              private learningAlgorithmService: LearningAlgorithmService,
              private settingsApi: SettingsApiService,
              private symbolGroupApi: SymbolGroupApiService,
              private formulaSuiteApi: LtsFormulaSuiteApiService) { }

  ngOnInit(): void {
    this.selectedEnvironments.addItems(this.project.environments);
    this.selectedEnvironments.selectMany(this.setup.environments);

    this.symbolGroupApi.getAll(this.project.id).subscribe(
      groups => this.groups = groups,
      console.error
    );

    this.formulaSuiteApi.getAll(this.project.id).subscribe(
      formulaSuites => {
        this.formulaSuites = formulaSuites;
        this.selectedFormulaSuites.addItems(this.formulaSuites);
        this.selectedFormulaSuites.selectMany(this.setup.modelCheckingConfig.formulaSuites);
      },
      console.error
    );
  }

  selectResetSymbol(): void {
    const modalRef = this.modalService.open(SelectSymbolModalComponent);
    modalRef.result.then((s: AlphabetSymbol) => {
      this.setup.preSymbol = ParametrizedSymbol.fromSymbol(s);
    }).catch(() => {
    });
  }

  selectPostSymbol(): void {
    const modalRef = this.modalService.open(SelectSymbolModalComponent);
    modalRef.result.then((s: AlphabetSymbol) => {
      this.setup.postSymbol = ParametrizedSymbol.fromSymbol(s);
    }).catch(() => {
    });
  }

  selectSymbol(symbol: AlphabetSymbol): void {
    this.setup.symbols.push(ParametrizedSymbol.fromSymbol(symbol));
  }

  selectSymbolGroup(group: SymbolGroup): void {
    group.symbols.forEach(s => this.setup.symbols.push(ParametrizedSymbol.fromSymbol(s)));
  }

  setEqOracle(eqOracle: any): void {
    this.setup.equivalenceOracle = eqOracle;
  }

  setLearningAlgorithm(): void {
    this.setup.algorithm = this.learningAlgorithmService.createFromType(this.selectedLearningAlgorithm);
  }

  selectEnvironments(): void {
    this.setup.environments = [...this.selectedEnvironments.getSelected()];
  }

  selectFormulaSuites(): void {
    this.setup.modelCheckingConfig.formulaSuites = [...this.selectedFormulaSuites.getSelected()];
  }

  get project(): Project {
    return this.appStore.project;
  }

  get allParametrizedSymbols(): ParametrizedSymbol[] {
    const ps = [];
    if (this.setup.preSymbol != null) {
      ps.push(this.setup.preSymbol);
    }
    this.setup.symbols.forEach(s => ps.push(s));
    if (this.setup.postSymbol != null) {
      ps.push(this.setup.postSymbol);
    }
    return ps;
  }
}
