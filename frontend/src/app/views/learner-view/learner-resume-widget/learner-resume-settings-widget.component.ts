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

import { eqOracleType } from '../../../constants';
import { ParametrizedSymbol } from '../../../entities/parametrized-symbol';
import { AlphabetSymbol } from '../../../entities/alphabet-symbol';
import { Project } from '../../../entities/project';
import { LearnerResult } from '../../../entities/learner-result';
import { EqOracle } from '../../../entities/eq-oracles/eq-oracle';
import { Component, Input } from '@angular/core';
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
export class LearnerResumeSettingsWidgetComponent {

  @Input()
  symbols: AlphabetSymbol[];

  @Input()
  configuration: any;

  @Input()
  project: Project;

  @Input()
  result: LearnerResult;

  eqOracleTypes: any = eqOracleType;

  selectedSymbol: string = null;

  form = new FormGroup({});

  addSelectedSymbol(): void {
    const id = Number(this.selectedSymbol);
    const s = this.symbols.find(s2 => s2.id === id);
    this.configuration.symbolsToAdd.push(ParametrizedSymbol.fromSymbol(s));
    this.selectedSymbol = null;
  }

  /**
   * Creates a new eq oracle object from the selected type and assigns it to the configuration.
   */
  setEqOracle(eqOracle: EqOracle): void {
    this.configuration.eqOracle = eqOracle;
  }
}
