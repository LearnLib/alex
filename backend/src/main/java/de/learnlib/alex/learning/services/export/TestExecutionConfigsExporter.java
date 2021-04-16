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

package de.learnlib.alex.learning.services.export;

import com.fasterxml.jackson.annotation.JsonIgnore;
import de.learnlib.alex.auth.entities.User;
import de.learnlib.alex.data.entities.Project;
import de.learnlib.alex.data.entities.ProjectEnvironment;
import de.learnlib.alex.data.entities.ProjectEnvironmentVariable;
import de.learnlib.alex.data.entities.ProjectUrl;
import de.learnlib.alex.data.entities.export.ExportableEntity;
import de.learnlib.alex.data.services.export.EntityExporter;
import de.learnlib.alex.testing.dao.TestExecutionConfigDAO;
import de.learnlib.alex.testing.entities.Test;
import de.learnlib.alex.testing.entities.TestExecutionConfig;
import de.learnlib.alex.testing.entities.export.TestExecutionConfigExportableEntity;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@Transactional(rollbackFor = Exception.class, readOnly = true)
public class TestExecutionConfigsExporter extends EntityExporter {

    private final TestExecutionConfigDAO testExecutionConfigDAO;

    @Autowired
    public TestExecutionConfigsExporter(TestExecutionConfigDAO testExecutionConfigDAO) {
        super();

        this.testExecutionConfigDAO = testExecutionConfigDAO;

        om.addMixIn(TestExecutionConfig.class, IgnoreFieldsForTestExecutionConfigMixin.class);
        om.addMixIn(ProjectEnvironment.class, IgnoreFieldsForProjectEnvironmentMixin.class);
    }

    public ExportableEntity export(User user, Long projectId) throws Exception {
        final var configs = testExecutionConfigDAO.getAll(user, projectId);

        return new TestExecutionConfigExportableEntity(version, om.readTree(om.writeValueAsString(configs)));
    }

    private abstract static class IgnoreFieldsForTestExecutionConfigMixin extends IgnoreIdFieldMixin {
        @JsonIgnore
        abstract Project getProject();

        @JsonIgnore
        abstract Long getProjectId();

        @JsonIgnore
        abstract List<Test> getTests();

        @JsonIgnore
        abstract Long getEnvironmentId();
    }

    private abstract static class IgnoreFieldsForProjectEnvironmentMixin extends IgnoreIdFieldMixin {
        @JsonIgnore
        abstract Long getProjectId();

        @JsonIgnore
        abstract List<ProjectUrl> getUrls();

        @JsonIgnore
        abstract boolean isDefault();

        @JsonIgnore
        abstract List<ProjectEnvironmentVariable> getVariables();
    }
}
