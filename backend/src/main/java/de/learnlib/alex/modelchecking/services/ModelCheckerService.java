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

package de.learnlib.alex.modelchecking.services;

import de.learnlib.alex.auth.entities.User;
import de.learnlib.alex.common.exceptions.NotFoundException;
import de.learnlib.alex.learning.dao.LearnerResultDAO;
import de.learnlib.alex.learning.entities.LearnerResult;
import de.learnlib.alex.learning.entities.LearnerResultStep;
import de.learnlib.alex.modelchecking.dao.LtsFormulaDAO;
import de.learnlib.alex.modelchecking.dao.ModelCheckingResultDAO;
import de.learnlib.alex.modelchecking.entities.LtsCheckingConfig;
import de.learnlib.alex.modelchecking.entities.LtsFormula;
import de.learnlib.alex.modelchecking.entities.LtsFormulaSuite;
import de.learnlib.alex.modelchecking.entities.ModelCheckingConfig;
import de.learnlib.alex.modelchecking.entities.ModelCheckingResult;
import java.util.ArrayList;
import java.util.Collection;
import java.util.List;
import java.util.function.Function;
import java.util.stream.Collectors;
import net.automatalib.automata.transducers.impl.compact.CompactMealy;
import net.automatalib.modelcheckers.ltsmin.LTSminLTLParser;
import net.automatalib.modelcheckers.ltsmin.ltl.LTSminLTLIO;
import net.automatalib.modelcheckers.ltsmin.ltl.LTSminLTLIOBuilder;
import net.automatalib.words.Alphabet;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

/** Service that is used to execute model checks on learned models. */
@Service
public class ModelCheckerService {

    private final LearnerResultDAO learnerResultDAO;
    private final LtsFormulaDAO ltsFormulaDAO;
    private final ModelCheckingResultDAO modelCheckingResultDAO;

    @Autowired
    public ModelCheckerService(LearnerResultDAO learnerResultDAO,
                               LtsFormulaDAO ltsFormulaDAO,
                               ModelCheckingResultDAO modelCheckingResultDAO) {
        this.learnerResultDAO = learnerResultDAO;
        this.ltsFormulaDAO = ltsFormulaDAO;
        this.modelCheckingResultDAO = modelCheckingResultDAO;
    }

    public List<ModelCheckingResult> check(LearnerResultStep step, ModelCheckingConfig config) {
        final var alphabet = step.getHypothesis().createAlphabet();
        final var hypothesis = step.getHypothesis().createMealyMachine(alphabet);

        final var formulas = config.getFormulaSuites().stream()
                .map(LtsFormulaSuite::getFormulas)
                .flatMap(Collection::stream)
                .collect(Collectors.toList());

        final var results = check(hypothesis, alphabet, formulas, config.getMinUnfolds(), config.getMultiplier());
        return modelCheckingResultDAO.create(results);
    }

    /**
     * Check formulas against a learned model in a learner result.
     *
     * @param user
     *         The user.
     * @param projectId
     *         The ID of the project.
     * @param config
     *         The configuration to use for checking.
     * @return A map of possible counterexample (formulaId -> counterexample).
     * @throws NotFoundException
     *         If the project or a lts formula could not be found.
     */
    public List<ModelCheckingResult> check(User user, Long projectId, LtsCheckingConfig config) throws NotFoundException {
        for (LtsFormula formula : config.getFormulas()) {
            if (!LTSminLTLParser.isValidIOFormula(formula.getFormula())) {
                throw new IllegalArgumentException("Formula '" + formula.getFormula() + "' is not formatted correctly");
            }
        }

        final List<LtsFormula> formulasToCheck = new ArrayList<>(config.getFormulas());
        formulasToCheck.addAll(ltsFormulaDAO.getByIds(user, projectId, config.getFormulaIds()));

        final LearnerResult learnerResult = learnerResultDAO.getByTestNo(user, projectId, config.getLearnerResultId());
        final LearnerResultStep step = learnerResult.getSteps().get(config.getStepNo() - 1);

        final Alphabet<String> alphabet = step.getHypothesis().createAlphabet();
        final CompactMealy<String, String> hypothesis = step.getHypothesis().createMealyMachine(alphabet);

        return check(hypothesis, alphabet, formulasToCheck, config.getMinUnfolds(), config.getMultiplier());
    }

    private List<ModelCheckingResult> check(CompactMealy<String, String> model, Alphabet<String> alphabet, List<LtsFormula> formulas, int minUnfolds, double multiplier) {
        final LTSminLTLIO<String, String> ltsmin = new LTSminLTLIOBuilder<String, String>()
                .withString2Input(Function.identity())
                .withString2Output(Function.identity())
                .withMinimumUnfolds(minUnfolds)
                .withMultiplier(multiplier)
                .create();

        return formulas.stream().map(f -> {
            final var ce = ltsmin.findCounterExample(model, alphabet, f.getFormula());
            final var result = new ModelCheckingResult();
            result.setFormula(f);
            if (ce != null) {
                result.setPrefix(ce.getPrefix().asList());
                result.setLoop(ce.getLoop().asList());
            }
            return result;
        }).collect(Collectors.toList());
    }
}
