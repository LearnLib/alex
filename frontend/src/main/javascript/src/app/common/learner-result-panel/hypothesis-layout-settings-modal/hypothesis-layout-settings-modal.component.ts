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

import { Component, Input, OnInit } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { FormUtilsService } from '../../../services/form-utils.service';

interface LayoutProperties {
  nodesep: number,
  edgesep: number,
  ranksep: number
}

/**
 * The controller that handles the modal dialog for changing the layout settings of a hypothesis.
 */
@Component({
  selector: 'hypothesis-layout-settings-modal',
  templateUrl: './hypothesis-layout-settings-modal.component.html'
})
export class HypothesisLayoutSettingsModalComponent implements OnInit {

  /** The layout properties to apply on the model. */
  @Input()
  layoutSettings: LayoutProperties;

  form = new FormGroup({
    nodesep: new FormControl(50, [Validators.required, Validators.min(1)]),
    edgesep: new FormControl(25, [Validators.required, Validators.min(1)]),
    ranksep: new FormControl(50, [Validators.required, Validators.min(1)])
  });

  constructor(public modal: NgbActiveModal,
              public formUtils: FormUtilsService) {
  }

  ngOnInit(): void {
    if (this.layoutSettings != null) {
      this.form.controls.nodesep.setValue(this.layoutSettings.nodesep);
      this.form.controls.edgesep.setValue(this.layoutSettings.edgesep);
      this.form.controls.ranksep.setValue(this.layoutSettings.ranksep);
    }
  }

  /**
   * Closes the modal window and passes the updated layout settings.
   */
  update(): void {
    this.modal.close(this.form.value);
  }

  /**
   * Sets the layout settings to its default values.
   */
  defaultLayoutSettings(): void {
    this.form.controls.nodesep.setValue(50);
    this.form.controls.edgesep.setValue(25);
    this.form.controls.ranksep.setValue(50);
  }
}
