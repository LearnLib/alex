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

package de.learnlib.alex.data.services.export;

import com.fasterxml.jackson.annotation.JsonIgnore;
import de.learnlib.alex.auth.entities.User;
import de.learnlib.alex.common.exceptions.NotFoundException;
import de.learnlib.alex.data.dao.ProjectDAO;
import de.learnlib.alex.data.entities.Project;
import de.learnlib.alex.data.entities.ProjectEnvironment;
import de.learnlib.alex.data.entities.ProjectEnvironmentVariable;
import de.learnlib.alex.data.entities.ProjectUrl;
import de.learnlib.alex.data.entities.export.ExportableEntity;
import de.learnlib.alex.data.entities.export.ProjectExportableEntity;
import de.learnlib.alex.data.entities.export.SymbolGroupsExportableEntity;
import de.learnlib.alex.data.repositories.ProjectRepository;
import de.learnlib.alex.testing.entities.export.TestsExportableEntity;
import de.learnlib.alex.testing.services.export.TestsExporter;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class ProjectExporter extends EntityExporter {

    @Autowired
    private ProjectRepository projectRepository;

    @Autowired
    private ProjectDAO projectDAO;

    @Autowired
    private SymbolsExporter symbolsExporter;

    @Autowired
    private TestsExporter testsExporter;

    @Transactional
    public ExportableEntity export(User user, Long projectId) throws Exception {
        om.addMixIn(Project.class, IgnoreFieldsForProjectMixin.class);
        om.addMixIn(ProjectEnvironment.class, IgnoreFieldsForProjectEnvironmentMixin.class);
        om.addMixIn(ProjectUrl.class, IgnoreFieldsForProjectUrlMixin.class);
        om.addMixIn(ProjectEnvironmentVariable.class, IgnoreFieldsForProjectVariableMixin.class);

        final Project project = projectRepository.findById(projectId)
                .orElseThrow(() -> new NotFoundException("The project could not be found"));
        projectDAO.checkAccess(user, project);

        final ProjectExportableEntity exportableEntity = new ProjectExportableEntity(version, om.readTree(om.writeValueAsString(project)));
        exportableEntity.setGroups(((SymbolGroupsExportableEntity) symbolsExporter.exportAll(user, projectId)).getSymbolGroups());
        exportableEntity.setTests(((TestsExportableEntity) testsExporter.exportAll(user, projectId)).getTests());

        return exportableEntity;
    }

    private static abstract class IgnoreFieldsForProjectMixin extends IgnoreIdFieldMixin {
        @JsonIgnore abstract Long getUserId();
    }

    private static abstract class IgnoreFieldsForProjectEnvironmentMixin extends IgnoreIdFieldMixin {
        @JsonIgnore abstract Long getProjectId();
    }

    private static abstract class IgnoreFieldsForProjectUrlMixin extends IgnoreIdFieldMixin {
        @JsonIgnore abstract Long getEnvironmentId();
    }

    private static abstract class IgnoreFieldsForProjectVariableMixin extends IgnoreFieldsForProjectUrlMixin {
    }
}
