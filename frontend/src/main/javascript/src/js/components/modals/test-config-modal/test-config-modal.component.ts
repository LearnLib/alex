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

import {ModalComponent} from '../modal.component';
import {Project} from '../../../entities/project';
import { ProjectEnvironment } from '../../../entities/project-environment';

/**
 * A modal dialog for the web driver configuration.
 */
export const testConfigModalComponent = {
  template: require('./test-config-modal.component.html'),
  bindings: {
    dismiss: '&',
    close: '&',
    resolve: '='
  },
  controllerAs: 'vm',
  controller: class TestConfigModalComponent extends ModalComponent {

    /** The web driver configuration. */
    public configuration: any = null;

    /** The current project. */
    public project: Project = null;

    /** The model for the url ids. */
    public selectedEnvironment: ProjectEnvironment;

    /** Constructor. */
    constructor() {
      super();
    }

    $onInit(): void {
      this.configuration = this.resolve.configuration;
      this.selectedEnvironment = this.configuration.environment;
      this.project = this.resolve.project;
    }

    /**
     * Close the modal window and pass the configuration.
     */
    update(): void {
      this.configuration.environment = this.selectedEnvironment;
      this.close({$value: this.configuration});
    }
  }
};
