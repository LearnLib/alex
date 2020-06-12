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

import { Project } from '../../../entities/project';
import { ProjectEnvironment } from '../../../entities/project-environment';
import { Component, Input, OnInit } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

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

  /** Constructor. */
  constructor(public modal: NgbActiveModal) {
  }

  ngOnInit(): void {
    this.selectedEnvironment = this.project.getDefaultEnvironment();
  }

  /**
   * Close the modal window and pass the configuration.
   */
  update(): void {
    this.configuration.environment = this.selectedEnvironment;
    this.modal.close(this.configuration);
  }
}

