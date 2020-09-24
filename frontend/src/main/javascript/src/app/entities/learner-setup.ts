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

import { ParametrizedSymbol } from './parametrized-symbol';
import { ProjectEnvironment } from './project-environment';
import { RandomEqOracle } from './eq-oracles/random-eq-oracle';
import { DriverConfigService } from '../services/driver-config.service';
import { learningAlgorithm, webBrowser } from '../constants';

export class LearnerSetup {

  id: number;
  project: number;
  preSymbol: ParametrizedSymbol;
  symbols: ParametrizedSymbol[];
  postSymbol?: ParametrizedSymbol;
  enableCache: boolean;
  name?: string;
  environments: ProjectEnvironment[];
  algorithm: any;
  equivalenceOracle: any;
  webDriver: any;
  saved: boolean;

  constructor() {
    this.symbols = [];
    this.environments = [];
    this.saved = false;
    this.equivalenceOracle = new RandomEqOracle();
    this.enableCache = true;
    this.webDriver = DriverConfigService.createFromName(webBrowser.HTML_UNIT);
    this.algorithm = {
      name: learningAlgorithm.TTT
    };
  }

  static fromData(data: any = {}): LearnerSetup {
    const ls = new LearnerSetup();
    ls.id = data.id;
    ls.project = data.project;
    ls.saved = data.saved;
    ls.name = data.name;
    ls.enableCache = data.enableCache;
    ls.algorithm = data.algorithm;
    ls.equivalenceOracle = data.equivalenceOracle;
    ls.webDriver = data.webDriver;
    ls.preSymbol = new ParametrizedSymbol(data.preSymbol);
    ls.symbols = data.symbols.map(s => new ParametrizedSymbol(s));
    if (data.postSymbol != null) {
      ls.postSymbol = new ParametrizedSymbol(data.postSymbol);
    }
    ls.environments = data.environments.map(e => ProjectEnvironment.fromData(e));
    return ls;
  }

  copy(): LearnerSetup {
    return LearnerSetup.fromData(JSON.parse(JSON.stringify(this)));
  }
}