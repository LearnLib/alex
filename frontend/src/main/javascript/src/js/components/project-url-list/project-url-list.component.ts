/*
 * Copyright 2018 TU Dortmund
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

import {Project, ProjectUrl} from '../../entities/project';

/**
 * The list for selecting target URLs for learning and testing.
 */
export const projectUrlListComponent = {
  template: require('./project-url-list.component.html'),
  bindings: {
    project: '=',
    listModel: '=',
    multiple: '='
  },
  controllerAs: 'vm',
  controller: class ProjectUrlListComponent {

    /** The current project. */
    public project: Project;

    /** The list of url ids. */
    public listModel: ProjectUrl[];

    /** If multiple URLs can be selected. */
    public multiple: boolean;

    /** Constructor. */
    constructor() {
      this.project = null;
      this.listModel = [];
      this.multiple = true;
    }

    $onInit(): void {
      if (this.listModel.length === 0) {
        this.listModel.push(this.project.getDefaultUrl());
      }
    }

    isSelected(url: ProjectUrl): boolean {
      return this.listModel.find(u => u.id === url.id) != null;
    }

    /**
     * Select or deselect the URL.
     *
     * @param url The selected URL.
     */
    toggleUrl(url: ProjectUrl): void {
      if (this.multiple) {
        this.toggleUrlMultiple(url);
      } else {
        this.toggleUrlSingle(url);
      }
    }

    private toggleUrlSingle(url: ProjectUrl): void {
      const i = this.listModel.findIndex(u => u.id === url.id);
      if (i === -1) {
        this.listModel = [url];
      }
    }

    private toggleUrlMultiple(url: ProjectUrl): void {
      const i = this.listModel.findIndex(u => u.id === url.id);
      if (i > -1) {
        if (this.listModel.length > 1) {
          this.listModel.splice(i, 1);
        }
      } else {
        this.listModel.push(url);
      }
    }
  }
};
