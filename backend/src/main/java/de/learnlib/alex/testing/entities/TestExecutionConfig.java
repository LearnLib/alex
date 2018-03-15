/*
 * Copyright 2016 TU Dortmund
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

package de.learnlib.alex.testing.entities;

import de.learnlib.alex.learning.entities.webdrivers.AbstractWebDriverConfig;

import java.util.ArrayList;
import java.util.List;

/**
 * The configuration class for running multiple tests in a batch.
 */
public class TestExecutionConfig {

    /** The ids of the tests to execute. */
    private List<Long> testIds;

    /** The configuration for the web driver. */
    private AbstractWebDriverConfig driverConfig;

    /** If a report should be created. */
    private boolean createReport;

    /** Constructor. */
    public TestExecutionConfig() {
        this.testIds = new ArrayList<>();
    }

    /**
     * Constructor.
     *
     * @param testIds      The ids of the tests.
     * @param driverConfig The configuration for the web driver.
     */
    public TestExecutionConfig(List<Long> testIds, AbstractWebDriverConfig driverConfig) {
        this.testIds = testIds;
        this.driverConfig = driverConfig;
    }

    public List<Long> getTestIds() {
        return testIds;
    }

    public void setTestIds(List<Long> testIds) {
        this.testIds = testIds;
    }

    public AbstractWebDriverConfig getDriverConfig() {
        return driverConfig;
    }

    public void setDriverConfig(AbstractWebDriverConfig driverConfig) {
        this.driverConfig = driverConfig;
    }

    public boolean isCreateReport() {
        return createReport;
    }

    public void setCreateReport(boolean createReport) {
        this.createReport = createReport;
    }
}
