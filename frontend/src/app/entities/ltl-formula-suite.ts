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

import { LtlFormula } from './ltl-formula';

export class LtlFormulaSuite {

  id: number;
  name: string;
  project: number;
  formulas: LtlFormula[] = [];

  public static fromData(data: any = {}): LtlFormulaSuite {
    const fs = new LtlFormulaSuite();
    fs.id = data.id;
    fs.name = data.name;
    fs.project = data.project;

    if (data.formulas !== null && data.formulas.length > 0) {
      fs.formulas = data.formulas.map(f => LtlFormula.fromData(f));
    }

    return fs;
  }
}
