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

import { eqOracleType } from '../../../constants';
import { ParametrizedSymbol } from '../../../entities/parametrized-symbol';
import { AlphabetSymbol } from '../../../entities/alphabet-symbol';
import { Project } from '../../../entities/project';
import { LearnerResult } from '../../../entities/learner-result';
import { EqOracle } from '../../../entities/eq-oracles/eq-oracle';
import { ProjectEnvironment } from '../../../entities/project-environment';
import { Selectable } from '../../../utils/selectable';
import { Component, Input, OnInit } from '@angular/core';
import { FormGroup } from '@angular/forms';

/**
 * The directive for the widget of the sidebar where learn resume configurations can be edited. Should be included
 * into a <div widget></div> directive for visual appeal.
 */
@Component({
  selector: 'learner-resume-settings-widget',
  templateUrl: './learner-resume-settings-widget.component.html',
  styleUrls: ['./learner-resume-settings-widget.component.scss']
})
export class LearnerResumeSettingsWidgetComponent implements OnInit {

  eqOracleTypes: any = eqOracleType;

  @Input()
  symbols: AlphabetSymbol[];

  @Input()
  configuration: any;

  @Input()
  project: Project;

  @Input()
  result: LearnerResult;

  /** The selected symbol to add. */
  selectedSymbol: string = null;

  selectedEnvironments: Selectable<ProjectEnvironment, number>;

  form = new FormGroup({});

  ngOnInit(): void {
    this.selectedEnvironments = new Selectable<ProjectEnvironment, number>(env => env.id);
    this.selectedEnvironments.addItems(this.configuration.environments);
  }

  addSelectedSymbol(): void {
    const id = parseInt(this.selectedSymbol);
    const s = this.symbols.find(s => s.id === id);
    this.configuration.symbolsToAdd.push(ParametrizedSymbol.fromSymbol(s));
    this.selectedSymbol = null;
  }

  /**
   * Creates a new eq oracle object from the selected type and assigns it to the configuration.
   */
  setEqOracle(eqOracle: EqOracle): void {
    this.configuration.eqOracle = eqOracle;
  }

  updateEnvironments(): void {
    this.configuration.environments = this.selectedEnvironments.getSelected();
  }
}
