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

package de.learnlib.alex.modelchecking.dao;

import de.learnlib.alex.auth.entities.User;
import de.learnlib.alex.common.exceptions.NotFoundException;
import de.learnlib.alex.data.dao.ProjectDAO;
import de.learnlib.alex.data.entities.Project;
import de.learnlib.alex.learning.repositories.LearnerSetupRepository;
import de.learnlib.alex.modelchecking.entities.LtsFormulaSuite;
import de.learnlib.alex.modelchecking.repositories.LtsFormulaSuiteRepository;
import org.apache.shiro.authz.UnauthorizedException;
import org.hibernate.Hibernate;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@Transactional(rollbackFor = Exception.class)
public class LtsFormulaSuiteDAO {

    private final ProjectDAO projectDAO;
    private final LtsFormulaSuiteRepository formulaSuiteRepository;
    private final LearnerSetupRepository learnerSetupRepository;
    private final LtsFormulaDAO ltsFormulaDAO;

    @Autowired
    public LtsFormulaSuiteDAO(
            ProjectDAO projectDAO,
            LtsFormulaSuiteRepository formulaSuiteRepository,
            LearnerSetupRepository learnerSetupRepository,
            LtsFormulaDAO ltsFormulaDAO
    ) {
        this.projectDAO = projectDAO;
        this.formulaSuiteRepository = formulaSuiteRepository;
        this.learnerSetupRepository = learnerSetupRepository;
        this.ltsFormulaDAO = ltsFormulaDAO;
    }

    public List<LtsFormulaSuite> getAll(User user, Long projectId) {
        final Project project = projectDAO.getByID(user, projectId);
        final List<LtsFormulaSuite> suites = formulaSuiteRepository.findAllByProject_Id(project.getId());
        suites.forEach(this::loadLazyRelations);
        return suites;
    }

    public LtsFormulaSuite get(User user, Long projectId, Long suiteId) {
        final Project project = projectDAO.getByID(user, projectId);
        final LtsFormulaSuite suiteInDb = formulaSuiteRepository.findById(suiteId).orElse(null);
        checkAccess(user, project, suiteInDb);
        return loadLazyRelations(suiteInDb);
    }

    public LtsFormulaSuite create(User user, Long projectId, LtsFormulaSuite suite) {
        final Project project = projectDAO.getByID(user, projectId);
        checkSuiteNameIsUnique(projectId, suite.getName());

        final LtsFormulaSuite s = new LtsFormulaSuite();
        s.setName(suite.getName());
        s.setProject(project);

        final LtsFormulaSuite createdSuite = formulaSuiteRepository.save(s);
        return loadLazyRelations(createdSuite);
    }

    public LtsFormulaSuite update(User user, Long projectId, Long suiteId, LtsFormulaSuite suite) {
        final LtsFormulaSuite suiteInDb = get(user, projectId, suiteId);
        checkSuiteNameIsUnique(projectId, suiteId, suite.getName());

        suiteInDb.setName(suite.getName());

        final LtsFormulaSuite updatedSuite = formulaSuiteRepository.save(suiteInDb);
        return loadLazyRelations(updatedSuite);
    }

    public void delete(User user, Long projectId, Long suiteId) {
        final LtsFormulaSuite suiteInDb = get(user, projectId, suiteId);

        // delete references in model checking configs of learner setups
        final var setups = learnerSetupRepository.findAllByProject_Id(projectId);
        for (var setup: setups) {
            var config = setup.getModelCheckingConfig();
            if (config.getFormulaSuites().contains(suiteInDb)) {
                config.getFormulaSuites().remove(suiteInDb);
                learnerSetupRepository.save(setup);
            }
        }

        for (var formula: suiteInDb.getFormulas()) {
            ltsFormulaDAO.delete(projectId, formula);
        }
        suiteInDb.getFormulas().clear();

        formulaSuiteRepository.delete(suiteInDb);
    }

    public void delete(User user, Long projectId, List<Long> suiteIds) {
        for (Long id: suiteIds) {
            delete(user, projectId, id);
        }
    }

    public void checkSuiteNameIsUnique(Long projectId, String name) {
       if (formulaSuiteRepository.findByProject_IdAndName(projectId, name) != null) {
           throw new IllegalArgumentException("The name of the formula suite is not unique.");
       }
    }

    public void checkSuiteNameIsUnique(Long projectId, Long suiteId, String name) {
        final LtsFormulaSuite suite = formulaSuiteRepository.findByProject_IdAndName(projectId, name);
        if (suite != null && !suite.getId().equals(suiteId)) {
            throw new IllegalArgumentException("The name of the formula suite is not unique.");
        }
    }

    public void checkAccess(User user, Project project, LtsFormulaSuite suite) {
        projectDAO.checkAccess(user, project);

        if (suite == null) {
            throw new NotFoundException("The formula suite could not be found.");
        }

        if (!suite.getProject().getId().equals(project.getId())) {
            throw new UnauthorizedException("You are not allowed to access the resource.");
        }
    }

    public LtsFormulaSuite loadLazyRelations(LtsFormulaSuite suite) {
        Hibernate.initialize(suite.getFormulas());
        return suite;
    }
}
