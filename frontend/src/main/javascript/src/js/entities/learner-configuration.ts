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

import {webBrowser} from '../constants';
import {DriverConfigService} from '../services/driver-config.service';
import {RandomEqOracle} from './eq-oracles/random-eq-oracle';
import {ParametrizedSymbol} from './parametrized-symbol';
import {ProjectUrl} from './project';

/**
 * The model for a learn configuration.
 */
export class LearnConfiguration {

  /** The list of ids of symbols to learn. */
  public symbols: ParametrizedSymbol[];

  /** The URLs to use for learning. */
  public urls: ProjectUrl[];

  /** The max amount of hypotheses to generate. */
  public maxAmountOfStepsToLearn: number;

  /** The EQ oracle to user. */
  public eqOracle: any;

  /** The algorithm to use for learning. */
  public algorithm: any;

  /** The id of the reset symbol. */
  public resetSymbol: ParametrizedSymbol;

  /** A comment. */
  public comment: string;

  /** The browser to use. */
  public driverConfig: any;

  /** If membership queries should be cached. */
  public useMQCache: boolean;

  public postSymbol: ParametrizedSymbol;

  /**
   * Constructor.
   *
   * @param obj The object to create a learn configuration from.
   */
  constructor(obj: any = {}) {
    this.symbols = obj.symbols || [];
    this.urls = obj.urls || [];
    this.maxAmountOfStepsToLearn = obj.maxAmountOfStepsToLearn || -1;
    this.eqOracle = obj.eqOracle || new RandomEqOracle(1, 10, 20);
    this.algorithm = obj.algorithm || {name: 'TTT'};
    this.resetSymbol = obj.resetSymbol || null;
    this.comment = obj.comment || null;
    this.driverConfig = obj.driverConfig || DriverConfigService.createFromName(webBrowser.HTML_UNIT);
    this.useMQCache = obj.useMQCache !== undefined ? obj.useMQCache : true;
    this.postSymbol = obj.postSymbol || null;
  }
}
