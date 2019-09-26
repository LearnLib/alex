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

import { TestReportResource } from '../../../services/resources/test-report-resource.service';
import { Project } from '../../../entities/project';

/**
 * The widget that displays the latest test report.
 */
export const latestTestReportWidgetComponent = {
  template: require('./latest-test-report-widget.component.html'),
  bindings: {
    project: '='
  },
  controllerAs: 'vm',
  controller: class LatestTestReportWidgetComponent {

    public project: Project;

    /** The test report. */
    public report: any = null;

    /**
     * Constructor.
     *
     * @param testReportResource
     */
    /* @ngInject */
    constructor(private testReportResource: TestReportResource) {
    }

    $onInit(): void {
      this.testReportResource.getLatest(this.project.id)
        .then(report => this.report = report)
        .catch(console.error);
    }
  }
};
