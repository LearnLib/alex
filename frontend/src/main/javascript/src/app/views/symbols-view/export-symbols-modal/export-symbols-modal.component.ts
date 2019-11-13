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

import { SymbolGroup } from '../../../entities/symbol-group';
import { DateUtils } from '../../../utils/date-utils';
import { DownloadService } from '../../../services/download.service';
import { ToastService } from '../../../services/toast.service';
import { AlphabetSymbol } from '../../../entities/alphabet-symbol';
import { SymbolApiService } from '../../../services/api/symbol-api.service';
import { Component, Input } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { FormUtilsService } from '../../../services/form-utils.service';

@Component({
  selector: 'symbols-export-modal',
  templateUrl: './export-symbols-modal.component.html'
})
export class ExportSymbolsModalComponent {

  /** The selected symbols. */
  @Input()
  public symbols: AlphabetSymbol[] = [];

  /** All symbol groups. */
  @Input()
  public groups: SymbolGroup[] = [];

  form = new FormGroup({
    filename: new FormControl('', [Validators.required]),
    exportSymbolsOnly: new FormControl(false)
  });

  constructor(private downloadService: DownloadService,
              private toastService: ToastService,
              private symbolApi: SymbolApiService,
              public modal: NgbActiveModal,
              public formUtils: FormUtilsService) {
    this.form.controls.filename.setValue('symbols-' + DateUtils.YYYYMMDD());
  }

  export(): void {
    const value = this.form.value;
    const symbolIds = this.symbols.map(s => s.id);
    this.symbolApi.export(this.groups[0].project, {
      symbolIds,
      symbolsOnly: value.exportSymbolsOnly
    }).subscribe(
      data => {
        this.downloadService.downloadObject(data, value.filename);
        this.toastService.success('The symbols have been exported.');
        this.modal.close();
      },
      console.error
    );
  }
}
