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

import { Project } from '../../../entities/project';
import { Component, Input, OnInit } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { TestConfigApiService } from '../../../services/api/test-config-api.service';
import { ToastService } from '../../../services/toast.service';
import { TestExecutionConfig } from '../../../entities/test-execution-config';

/**
 * A modal dialog for the web driver configuration.
 */
@Component({
  selector: 'test-config-modal',
  templateUrl: './test-config-modal.component.html'
})
export class TestConfigModalComponent implements OnInit {

  /** The web driver configuration. */
  @Input()
  configuration: TestExecutionConfig;

  /** The current project. */
  @Input()
  project: Project;

  /** Constructor. */
  constructor(public modal: NgbActiveModal,
              public testConfigApi: TestConfigApiService,
              public toastService: ToastService) {
  }

  ngOnInit(): void {
    if (this.configuration == null) {
      this.configuration = new TestExecutionConfig();
      this.configuration.environmentId = this.project.getDefaultEnvironment().id;
    }
  }

  update(): void {
    this.modal.close(this.configuration);
  }

  get validConfig(): boolean {
    return TestExecutionConfig.isValid(this.configuration);
  }
}
