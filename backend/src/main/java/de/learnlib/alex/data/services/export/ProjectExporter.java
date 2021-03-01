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

package de.learnlib.alex.data.services.export;

import com.fasterxml.jackson.annotation.JsonIgnore;
import de.learnlib.alex.auth.entities.User;
import de.learnlib.alex.data.dao.ProjectDAO;
import de.learnlib.alex.data.entities.Project;
import de.learnlib.alex.data.entities.ProjectEnvironment;
import de.learnlib.alex.data.entities.ProjectEnvironmentVariable;
import de.learnlib.alex.data.entities.ProjectUrl;
import de.learnlib.alex.data.entities.export.ExportableEntity;
import de.learnlib.alex.data.entities.export.ProjectExportableEntity;
import de.learnlib.alex.data.entities.export.SymbolGroupsExportableEntity;
import de.learnlib.alex.learning.entities.export.LearnerSetupExportableEntity;
import de.learnlib.alex.learning.services.export.LearnerSetupsExporter;
import de.learnlib.alex.modelchecking.entities.export.LtsFormulaSuitesExportableEntity;
import de.learnlib.alex.modelchecking.services.export.LtsFormulaSuitesExporter;
import de.learnlib.alex.testing.entities.export.TestsExportableEntity;
import de.learnlib.alex.testing.services.export.TestsExporter;
import java.util.List;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@Transactional(rollbackFor = Exception.class, readOnly = true)
public class ProjectExporter extends EntityExporter {

    private final ProjectDAO projectDAO;
    private final SymbolsExporter symbolsExporter;
    private final TestsExporter testsExporter;
    private final LtsFormulaSuitesExporter formulaSuitesExporter;
    private final LearnerSetupsExporter learnerSetupsExporter;

    @Autowired
    public ProjectExporter(
            ProjectDAO projectDAO,
            SymbolsExporter symbolsExporter,
            TestsExporter testsExporter,
            LtsFormulaSuitesExporter formulaSuitesExporter,
            LearnerSetupsExporter learnerSetupsExporter
    ) {
        this.projectDAO = projectDAO;
        this.symbolsExporter = symbolsExporter;
        this.testsExporter = testsExporter;
        this.formulaSuitesExporter = formulaSuitesExporter;
        this.learnerSetupsExporter = learnerSetupsExporter;
    }

    public ExportableEntity export(User user, Long projectId) throws Exception {
        om.addMixIn(Project.class, IgnoreFieldsForProjectMixin.class);
        om.addMixIn(ProjectEnvironment.class, IgnoreFieldsForProjectEnvironmentMixin.class);
        om.addMixIn(ProjectUrl.class, IgnoreFieldsForProjectUrlMixin.class);
        om.addMixIn(ProjectEnvironmentVariable.class, IgnoreFieldsForProjectVariableMixin.class);

        final var project = projectDAO.getByID(user, projectId);

        final var exportableEntity = new ProjectExportableEntity(version, om.readTree(om.writeValueAsString(project)));
        exportableEntity.setGroups(((SymbolGroupsExportableEntity) symbolsExporter.exportAll(user, projectId)).getSymbolGroups());
        exportableEntity.setTests(((TestsExportableEntity) testsExporter.exportAll(user, projectId)).getTests());
        exportableEntity.setFormulaSuites(((LtsFormulaSuitesExportableEntity) formulaSuitesExporter.export(user, projectId)).getFormulaSuites());
        exportableEntity.setLearnerSetups(((LearnerSetupExportableEntity) learnerSetupsExporter.export(user, projectId)).getLearnerSetups());

        return exportableEntity;
    }

    private abstract static class IgnoreFieldsForProjectMixin extends IgnoreIdFieldMixin {
        @JsonIgnore
        abstract Long getUserId();

        @JsonIgnore
        abstract List<Long> getMemberIds();

        @JsonIgnore
        abstract List<Long> getOwnerIds();
    }

    private abstract static class IgnoreFieldsForProjectEnvironmentMixin extends IgnoreIdFieldMixin {
        @JsonIgnore
        abstract Long getProjectId();
    }

    private abstract static class IgnoreFieldsForProjectUrlMixin extends IgnoreIdFieldMixin {
        @JsonIgnore
        abstract Long getEnvironmentId();
    }

    private abstract static class IgnoreFieldsForProjectVariableMixin extends IgnoreFieldsForProjectUrlMixin {
    }
}
