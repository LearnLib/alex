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

package de.learnlib.alex.modelchecking.dao;

import de.learnlib.alex.auth.entities.User;
import de.learnlib.alex.common.exceptions.NotFoundException;
import de.learnlib.alex.data.dao.ProjectDAO;
import de.learnlib.alex.data.entities.Project;
import de.learnlib.alex.data.repositories.ProjectRepository;
import de.learnlib.alex.modelchecking.entities.LtsFormula;
import de.learnlib.alex.modelchecking.repositories.LtsFormulaRepository;
import org.apache.shiro.authz.UnauthorizedException;
import org.springframework.stereotype.Service;

import javax.inject.Inject;
import javax.transaction.Transactional;
import java.util.List;

/** The implementations of the {@link de.learnlib.alex.modelchecking.dao.LtsFormulaDAO} . */
@Service
public class LtsFormulaDAOImpl implements LtsFormulaDAO {

    /** The DAO for projects. */
    private final ProjectDAO projectDAO;

    /** The repository for projects. */
    private final ProjectRepository projectRepository;

    /** The repository for lts formulas. */
    private final LtsFormulaRepository ltsFormulaRepository;

    /**
     * Constructor.
     *
     * @param projectDAO
     *         {@link #projectDAO}
     * @param projectRepository
     *         {@link #projectRepository}
     * @param ltsFormulaRepository
     *         {@link #ltsFormulaRepository}
     */
    @Inject
    public LtsFormulaDAOImpl(ProjectDAO projectDAO,
                             ProjectRepository projectRepository,
                             LtsFormulaRepository ltsFormulaRepository) {
        this.projectDAO = projectDAO;
        this.projectRepository = projectRepository;
        this.ltsFormulaRepository = ltsFormulaRepository;
    }

    @Override
    @Transactional
    public List<LtsFormula> getAll(User user, Long projectId) throws NotFoundException {
        final Project project = projectRepository.findById(projectId).orElse(null);
        projectDAO.checkAccess(user, project);

        return ltsFormulaRepository.findAllByProject_Id(projectId);
    }

    @Override
    @Transactional
    public LtsFormula create(User user, Long projectId, LtsFormula formula) throws NotFoundException {
        final Project project = projectRepository.findById(projectId).orElse(null);
        projectDAO.checkAccess(user, project);

        formula.setProject(project);
        formula.setId(null);

        return ltsFormulaRepository.save(formula);
    }

    @Override
    @Transactional
    public LtsFormula update(User user, Long projectId, LtsFormula formula) throws NotFoundException {
        final Project project = projectRepository.findById(projectId).orElse(null);
        final LtsFormula formulaInDb = ltsFormulaRepository.findById(formula.getId()).orElse(null);
        checkAccess(user, project, formulaInDb);

        formulaInDb.setName(formula.getName());
        formulaInDb.setFormula(formula.getFormula());

        return ltsFormulaRepository.save(formulaInDb);
    }

    @Override
    @Transactional
    public void delete(User user, Long projectId, Long formulaId) throws NotFoundException {
        final Project project = projectRepository.findById(projectId).orElse(null);
        final LtsFormula formula = ltsFormulaRepository.findById(formulaId).orElse(null);
        checkAccess(user, project, formula);

        ltsFormulaRepository.deleteById(formulaId);
    }

    @Override
    @Transactional(rollbackOn = Exception.class)
    public void delete(User user, Long projectId, List<Long> formulaIds) throws NotFoundException {
        for (final Long id : formulaIds) {
            delete(user, projectId, id);
        }
    }

    @Override
    public void checkAccess(User user, Project project, LtsFormula formula) throws NotFoundException {
        projectDAO.checkAccess(user, project);

        if (formula == null) {
            throw new NotFoundException("The formula could not be found.");
        }

        if (!formula.getProjectId().equals(project.getId())) {
            throw new UnauthorizedException("You are not allowed to access this resource.");
        }
    }
}
