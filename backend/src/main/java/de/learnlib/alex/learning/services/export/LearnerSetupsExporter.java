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

package de.learnlib.alex.learning.services.export;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.databind.module.SimpleModule;
import de.learnlib.alex.auth.entities.User;
import de.learnlib.alex.data.entities.ParameterizedSymbol;
import de.learnlib.alex.data.entities.Project;
import de.learnlib.alex.data.entities.ProjectEnvironment;
import de.learnlib.alex.data.entities.ProjectEnvironmentVariable;
import de.learnlib.alex.data.entities.ProjectUrl;
import de.learnlib.alex.data.entities.SymbolParameter;
import de.learnlib.alex.data.entities.SymbolParameterValue;
import de.learnlib.alex.data.entities.export.ExportableEntity;
import de.learnlib.alex.data.services.export.EntityExporter;
import de.learnlib.alex.data.services.export.SymbolsExporter;
import de.learnlib.alex.learning.dao.LearnerSetupDAO;
import de.learnlib.alex.learning.entities.LearnerSetup;
import de.learnlib.alex.learning.entities.export.LearnerSetupExportableEntity;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@Transactional(rollbackFor = Exception.class, readOnly = true)
public class LearnerSetupsExporter extends EntityExporter {

    private final LearnerSetupDAO learnerSetupDAO;

    @Autowired
    public LearnerSetupsExporter(LearnerSetupDAO learnerSetupDAO) {
        super();

        this.learnerSetupDAO = learnerSetupDAO;

        om.addMixIn(Project.class, IgnoreFieldsForProjectMixin.class);
        om.addMixIn(ParameterizedSymbol.class, IgnoreIdFieldMixin.class);
        om.addMixIn(SymbolParameter.class, IgnoreIdFieldMixin.class);
        om.addMixIn(SymbolParameterValue.class, IgnoreIdFieldMixin.class);
        om.addMixIn(LearnerSetup.class, IgnoreFieldsForLearnerSetupMixin.class);
        om.addMixIn(ProjectEnvironment.class, IgnoreFieldsForProjectEnvironmentMixin.class);
        om.addMixIn(ProjectUrl.class, IgnoreFieldsForProjectEnvironmentUrlMixin.class);
        om.addMixIn(ProjectEnvironmentVariable.class, IgnoreFieldsForProjectEnvironmentVariableMixin.class);

        final var module = new SimpleModule();
        module.addSerializer(new SymbolsExporter.ParameterizedSymbolSerializer(om, ParameterizedSymbol.class));
        om.registerModule(module);
    }

    public ExportableEntity export(User user, Long projectId) throws Exception {
        final var setups = learnerSetupDAO.getAll(user, projectId).stream()
                .filter(LearnerSetup::isSaved)
                .collect(Collectors.toList());

        return new LearnerSetupExportableEntity(version, om.readTree(om.writeValueAsString(setups)));
    }

    private abstract static class IgnoreFieldsForProjectMixin extends IgnoreIdFieldMixin {
        @JsonIgnore abstract Long getProjectId();
        @JsonIgnore abstract List<Long> getOwnerIds();
        @JsonIgnore abstract List<Long> getMemberIds();
    }

    private abstract static class IgnoreFieldsForLearnerSetupMixin extends IgnoreIdFieldMixin {
        @JsonIgnore abstract Project getProject();
    }

    private abstract static class IgnoreFieldsForProjectEnvironmentMixin extends IgnoreIdFieldMixin {
        @JsonIgnore abstract Long getProjectId();
    }

    private abstract static class IgnoreFieldsForProjectEnvironmentUrlMixin extends IgnoreIdFieldMixin {
        @JsonIgnore abstract Long getEnvironmentId();
    }

    private abstract static class IgnoreFieldsForProjectEnvironmentVariableMixin extends IgnoreIdFieldMixin {
        @JsonIgnore abstract Long getEnvironmentId();
    }
}
