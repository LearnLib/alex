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

import {ProjectService} from '../../../services/project.service';
import {TestResource} from '../../../services/resources/test-resource.service';
import {Project} from '../../../entities/project';

/**
 * The view for the tests.
 * @type {{controller: testsView.controller, controllerAs: string, templateUrl: string}}
 */
export const testsViewComponent = {
  template: require('./tests-view.component.html'),
  controllerAs: 'vm',
  controller: class TestsViewComponent {

    /** The test case or test suite. */
    public test: any;

    /**
     * Constructor.
     *
     * @param $state
     * @param projectService
     * @param testResource
     */
    /* @ngInject */
    constructor(private $state: any,
                private projectService: ProjectService,
                private testResource: TestResource) {

      this.test = null;

      const project: Project = projectService.store.currentProject;
      const testId: number = $state.params.testId;
      if (testId === 0) {
        testResource.getRoot(project.id)
          .then(data => this.test = data)
          .catch(err => $state.go('error', {message: err.data.message}));
      } else {
        testResource.get(project.id, testId)
          .then(data => this.test = data)
          .catch(err => $state.go('error', {message: err.data.message}));
      }
    }
  }
};
