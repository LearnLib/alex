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

package de.learnlib.alex.testing.events;

import de.learnlib.alex.testing.entities.TestExecutionConfig;

/** The data used for starting the test execution. */
public class TestExecutionStartedEventData extends TestExecutionConfig {

    /** The id of the project. */
    private Long projectId;

    /**
     * Constructor.
     *
     * @param projectId {@link #projectId}.
     * @param config    The configuration to use.
     */
    public TestExecutionStartedEventData(Long projectId, TestExecutionConfig config) {
        this.projectId = projectId;
        this.setTestIds(config.getTestIds());
        this.setDriverConfig(config.getDriverConfig());
        this.setCreateReport(config.isCreateReport());
    }

    public Long getProjectId() {
        return projectId;
    }

    public void setProjectId(Long projectId) {
        this.projectId = projectId;
    }
}


