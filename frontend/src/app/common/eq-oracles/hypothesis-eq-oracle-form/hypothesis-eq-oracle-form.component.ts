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

import { ToastService } from '../../../services/toast.service';
import { HypothesisEqOracle } from '../../../entities/eq-oracles/hypothesis-eq-oracle';
import { Component, Input } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { FileLoadedData } from '../../file-dropzone/file-dropzone.component';

@Component({
  selector: 'hypothesis-eq-oracle-form',
  templateUrl: './hypothesis-eq-oracle-form.component.html'
})
export class HypothesisEqOracleFormComponent {

  @Input()
  public form: FormGroup;

  @Input()
  public oracle: HypothesisEqOracle;

  constructor(private toastService: ToastService) {
  }

  /**
   * Load a hypothesis from a JSON file.
   *
   * @param data A hypothesis as JSON.
   */
  fileLoaded(data: FileLoadedData): void {
    try {
      this.oracle.hypothesis = JSON.parse(data.data);
    } catch (e) {
      this.toastService.danger('Could not load model. The file is not properly formatted');
    }
  }
}
