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

import { Project } from '../../../entities/project';
import { ProjectEnvironment } from '../../../entities/project-environment';
import { Component, Input, OnInit } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { TestConfigApiService } from "../../../services/api/test-config-api.service";
import { ToastService } from "../../../services/toast.service";

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
  configuration: any;

  /** The current project. */
  @Input()
  project: Project;

  /** The model for the url ids. */
  @Input()
  selectedEnvironment: ProjectEnvironment;

  /** The action for which this modal has been opened. */
  @Input()
  action: TestConfigModalAction;

  /** Constructor. */
  constructor(public modal: NgbActiveModal,
              public testConfigApi: TestConfigApiService,
              public toastService: ToastService) {
  }

  ngOnInit(): void {
    this.selectedEnvironment = this.project.getDefaultEnvironment();
  }

  create(): void {
    this.configuration.id = null;
    this.configuration.driverConfig.id = null;
    this.configuration.tests = [];
    this.configuration.project = this.project.id;
    this.configuration.environmentId = this.selectedEnvironment.id;

    this.testConfigApi.create(this.project.id, this.configuration).subscribe(config => {
      this.toastService.success('The config has been created.');
      this.modal.close(config);
    }, res => {
      this.toastService.danger(`The config couldn't be created. ${res.error.message}`);
      this.modal.dismiss();
    })
  }

  /**
   * Close the modal window and pass the configuration.
   */
  update(): void {
    this.configuration.environmentId = this.selectedEnvironment.id;
    console.log(this.configuration)
    this.testConfigApi.update(this.project.id, this.configuration).subscribe(config => {
      this.toastService.success('The config has been updated.');
      this.modal.close(config);
    }, res => {
      this.toastService.danger(`The config couldn't be updated. ${res.error.message}`);
      this.modal.dismiss();
    })
  }

  get TestConfigModalAction() {
    return TestConfigModalAction;
  }
}

export enum TestConfigModalAction {
  CREATE, EDIT
}
