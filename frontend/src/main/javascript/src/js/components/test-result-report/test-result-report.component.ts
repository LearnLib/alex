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

import {ProjectService} from '../../services/project.service';
import {TestReportService} from '../../services/test-report.service';
import {Project} from '../../entities/project';

/**
 * Displays a test result.
 */
export const testResultReportComponent = {
  template: require('./test-result-report.component.html'),
  bindings: {
    report: '='
  },
  controllerAs: 'vm',
  controller: class TestResultReportComponent {

    /** The report. */
    public report: any = null;

    /**
     * Constructor.
     *
     * @param projectService
     * @param testReportService
     */
    /* @ngInject */
    constructor(private projectService: ProjectService,
                private testReportService: TestReportService) {
    }

    /** Saves the report as JUnit XML. */
    exportReport(): void {
      this.testReportService.download(this.project.id, this.report.id);
    }

    get project(): Project {
      return this.projectService.store.currentProject;
    }
  }
};
