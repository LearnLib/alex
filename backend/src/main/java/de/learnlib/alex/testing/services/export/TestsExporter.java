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

package de.learnlib.alex.testing.services.export;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.module.SimpleModule;
import com.fasterxml.jackson.databind.node.ObjectNode;
import de.learnlib.alex.auth.entities.User;
import de.learnlib.alex.common.exceptions.NotFoundException;
import de.learnlib.alex.data.entities.ParameterizedSymbol;
import de.learnlib.alex.data.entities.Project;
import de.learnlib.alex.data.entities.SymbolParameter;
import de.learnlib.alex.data.entities.SymbolParameterValue;
import de.learnlib.alex.data.entities.export.ExportableEntity;
import de.learnlib.alex.data.repositories.ProjectRepository;
import de.learnlib.alex.data.services.export.EntityExporter;
import de.learnlib.alex.data.services.export.SymbolsExporter;
import de.learnlib.alex.testing.dao.TestDAO;
import de.learnlib.alex.testing.entities.Test;
import de.learnlib.alex.testing.entities.TestCaseStep;
import de.learnlib.alex.testing.entities.TestSuite;
import de.learnlib.alex.testing.entities.export.TestsExportConfig;
import de.learnlib.alex.testing.entities.export.TestsExportableEntity;
import de.learnlib.alex.testing.repositories.TestRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class TestsExporter extends EntityExporter {

    @Autowired
    private TestDAO testDAO;

    @Autowired
    private TestRepository testRepository;

    @Autowired
    private ProjectRepository projectRepository;

    public TestsExporter() {
        om.addMixIn(Test.class, IgnoreFieldsForTestMixin.class);
        om.addMixIn(TestCaseStep.class, IgnoreIdFieldMixin.class);
        om.addMixIn(ParameterizedSymbol.class, IgnoreIdFieldMixin.class);
        om.addMixIn(SymbolParameter.class, IgnoreIdFieldMixin.class);
        om.addMixIn(SymbolParameterValue.class, IgnoreIdFieldMixin.class);

        final SimpleModule module = new SimpleModule();
        module.addSerializer(new SymbolsExporter.ParameterizedSymbolSerializer(om, ParameterizedSymbol.class));
        om.registerModule(module);
    }

    @Transactional
    public ExportableEntity export(User user, Long projectId, TestsExportConfig config) throws Exception {
        final Project project = projectRepository.findById(projectId).orElseThrow(() -> new NotFoundException("The project could not be found"));

        final List<Test> tests = testRepository.findAllByProject_IdAndIdIn(projectId, config.getTestIds());
        for (Test test: tests) {
            testDAO.checkAccess(user, project, test);
        }

        final TestsExportableEntity exportableTests = new TestsExportableEntity(version, om.readTree(om.writeValueAsString(tests)));
        addTypeField(exportableTests.getTests());
        return exportableTests;
    }

    @Transactional
    public ExportableEntity exportAll(User user, Long projectId) throws Exception {
        final Project project = projectRepository.findById(projectId).orElseThrow(() -> new NotFoundException("The project could not be found"));
        final TestSuite root = (TestSuite) testRepository.findFirstByProject_IdOrderByIdAsc(projectId);
        final List<Test> tests = testRepository.findAllByProject_IdAndIdIn(projectId, root.getTests().stream().map(Test::getId).collect(Collectors.toList()));

        testDAO.checkAccess(user, project, root);
        final TestsExportableEntity exportableTests = new TestsExportableEntity(version, om.readTree(om.writeValueAsString(tests)));
        addTypeField(exportableTests.getTests());
        return exportableTests;
    }

    private void addTypeField(JsonNode tests) {
        tests.elements().forEachRemaining(node -> {
            final String type = node.has("tests") ? "suite" : "case";
            ((ObjectNode) node).put("type", type);
        });
    }

    private abstract static class IgnoreFieldsForTestMixin extends IgnoreIdFieldMixin {
        @JsonIgnore abstract Long getProjectId();
        @JsonIgnore abstract Long getParentId();
        @JsonIgnore abstract User getLastUpdatedBy();
    }
}
