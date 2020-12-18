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

package de.learnlib.alex.modelchecking.dao;

import de.learnlib.alex.auth.entities.User;
import de.learnlib.alex.common.exceptions.NotFoundException;
import de.learnlib.alex.data.entities.Project;
import de.learnlib.alex.data.repositories.ProjectRepository;
import de.learnlib.alex.learning.repositories.LearnerResultStepRepository;
import de.learnlib.alex.modelchecking.entities.LtsFormula;
import de.learnlib.alex.modelchecking.entities.LtsFormulaSuite;
import de.learnlib.alex.modelchecking.repositories.LtsFormulaRepository;
import de.learnlib.alex.modelchecking.repositories.ModelCheckingResultRepository;
import net.automatalib.modelcheckers.ltsmin.LTSminLTLParser;
import org.apache.shiro.authz.UnauthorizedException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Lazy;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@Transactional(rollbackFor = Exception.class)
public class LtsFormulaDAO {

    private final LtsFormulaRepository ltsFormulaRepository;
    private final LtsFormulaSuiteDAO ltsFormulaSuiteDAO;
    private final ProjectRepository projectRepository;
    private final LearnerResultStepRepository learnerResultStepRepository;
    private final ModelCheckingResultRepository modelCheckingResultRepository;

    @Autowired
    public LtsFormulaDAO(
            LtsFormulaRepository ltsFormulaRepository,
            @Lazy LtsFormulaSuiteDAO ltsFormulaSuiteDAO,
            ProjectRepository projectRepository,
            LearnerResultStepRepository learnerResultStepRepository,
            ModelCheckingResultRepository modelCheckingResultRepository
    ) {
        this.ltsFormulaRepository = ltsFormulaRepository;
        this.ltsFormulaSuiteDAO = ltsFormulaSuiteDAO;
        this.projectRepository = projectRepository;
        this.learnerResultStepRepository = learnerResultStepRepository;
        this.modelCheckingResultRepository = modelCheckingResultRepository;
    }

    public LtsFormula create(User user, Long projectId, Long suiteId, LtsFormula formula) {
        LTSminLTLParser.requireValidIOFormula(formula.getFormula());

        final LtsFormulaSuite suite = ltsFormulaSuiteDAO.get(user, projectId, suiteId);

        final LtsFormula f = new LtsFormula();
        f.setFormula(formula.getFormula());
        f.setName(formula.getName());
        f.setSuite(suite);

        return ltsFormulaRepository.save(f);
    }

    public List<LtsFormula> getByIds(User user, Long projectId, List<Long> formulaIds) {
        final Project project = projectRepository.findById(projectId)
                .orElseThrow(() -> new NotFoundException("Project could not be found"));

        final List<LtsFormula> formulas = ltsFormulaRepository.findAllByIdIn(formulaIds);
        for (LtsFormula formula: formulas) {
            checkAccess(user, project, formula.getSuite(), formula);
        }

        return formulas;
    }

    public LtsFormula update(User user, Long projectId, Long suiteId, LtsFormula formula) {
        LTSminLTLParser.requireValidIOFormula(formula.getFormula());

        final LtsFormulaSuite suite = ltsFormulaSuiteDAO.get(user, projectId, suiteId);
        final LtsFormula formulaInDb = ltsFormulaRepository.findById(formula.getId()).orElse(null);
        checkAccess(user, suite.getProject(), suite, formulaInDb);

        formulaInDb.setName(formula.getName());
        formulaInDb.setFormula(formula.getFormula());

        return ltsFormulaRepository.save(formulaInDb);
    }

    public List<LtsFormula> updateParent(User user, Long projectId, Long suiteId, List<Long> formulaIds, LtsFormulaSuite targetSuite) {
        final LtsFormulaSuite oldSuite = ltsFormulaSuiteDAO.get(user, projectId, suiteId);
        final LtsFormulaSuite newSuite = ltsFormulaSuiteDAO.get(user, projectId, targetSuite.getId());

        final List<LtsFormula> formulas = ltsFormulaRepository.findAllBySuite_IdAndIdIn(suiteId, formulaIds);
        for (LtsFormula f: formulas) {
            checkAccess(user, oldSuite.getProject(), oldSuite, f);
            f.setSuite(newSuite);
        }

        return ltsFormulaRepository.saveAll(formulas);
    }

    public void delete(User user, Long projectId, Long suiteId, Long formulaId) {
        final var suite = ltsFormulaSuiteDAO.get(user, projectId, suiteId);
        final var formula = ltsFormulaRepository.findById(formulaId).orElse(null);
        checkAccess(user, suite.getProject(), suite, formula);
        delete(projectId, formula);
    }

    public void delete(User user, Long projectId, Long suiteId, List<Long> formulaIds) {
        for (final Long id : formulaIds) {
            delete(user, projectId, suiteId, id);
        }
    }

    public void delete(Long projectId, LtsFormula formula) {
        // remove model checking results that reference the formula
        final var learnerResultSteps = learnerResultStepRepository.findAllByResult_Project_Id(projectId).stream()
                .filter(s -> !s.getModelCheckingResults().isEmpty())
                .collect(Collectors.toList());

        learnerResultSteps.forEach(s ->
                s.getModelCheckingResults().removeIf(r -> r.getFormula().getId().equals(formula.getId()))
        );

        learnerResultStepRepository.saveAll(learnerResultSteps);
        modelCheckingResultRepository.deleteAllByFormula_Id(formula.getId());
        ltsFormulaRepository.delete(formula);
    }

    public void checkAccess(User user, Project project, LtsFormulaSuite suite, LtsFormula formula) {
        ltsFormulaSuiteDAO.checkAccess(user, project, suite);

        if (formula == null) {
            throw new NotFoundException("The formula could not be found.");
        }

        if (!suite.getId().equals(formula.getSuite().getId())) {
            throw new UnauthorizedException("You are not allowed to access the resource.");
        }
    }
}
