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
import { LearnResult } from '../../../entities/learner-result';
import { EqOracle } from '../../../entities/eq-oracles/eq-oracle';
import { ProjectEnvironment } from "../../../entities/project-environment";
import { Selectable } from "../../../utils/selectable";

/**
 * The directive for the widget of the sidebar where learn resume configurations can be edited. Should be included
 * into a <div widget></div> directive for visual appeal.
 */
class LearnerResumeSettingsWidgetComponent {

  public symbols: AlphabetSymbol[];

  public configuration: any;

  public project: Project;

  public result: LearnResult;

  public eqOracleTypes: any = eqOracleType;

  /** The selected symbol to add. */
  public selectedSymbol: AlphabetSymbol = null;

  public selectedEnvironments: Selectable<ProjectEnvironment>;

  $onInit(): void {
    this.selectedEnvironments = new Selectable<ProjectEnvironment>(this.project.environments, 'id');
    this.selectedEnvironments.selectMany(this.configuration.environments);
  }

  addSelectedSymbol(): void {
    this.configuration.symbolsToAdd.push(ParametrizedSymbol.fromSymbol(this.selectedSymbol));
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

export const learnerResumeSettingsWidgetComponent = {
  template: require('html-loader!./learner-resume-settings-widget.component.html'),
  bindings: {
    symbols: '=',
    configuration: '=',
    project: '<',
    result: '<'
  },
  controller: LearnerResumeSettingsWidgetComponent,
  controllerAs: 'vm'
};
